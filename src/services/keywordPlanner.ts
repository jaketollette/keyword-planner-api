import { GoogleAdsApi, enums, services, ResourceNames } from 'google-ads-api';

export interface KeywordPlanRequestDTO {
  requestType: 'keywordAndUrlSeed' | 'keywordSeed' | 'urlSeed' | 'siteSeed';
  keywords?: string[];
  url?: string;
}

type KeywordCompetitionLevel = "LOW" | "MEDIUM" | "HIGH" | "UNSPECIFIED" | "UNKNOWN";

const competitionOrder: Record<KeywordCompetitionLevel, number> = {
  'LOW': 1,
  'MEDIUM': 2,
  'HIGH': 3,
  'UNSPECIFIED': 4,
  'UNKNOWN': 5
};

const CUSTOMER_ID = '7808970607';
// const CUSTOMER_ID = '9855835337'; // LIVE

export interface KeywordPlanResponseDTO {
  low: KeywordPlanResponseItemDTO[],
  medium: KeywordPlanResponseItemDTO[],
  high: KeywordPlanResponseItemDTO[],
}

export interface KeywordPlanResponseItemDTO {
  keyword: string;
  averageMonthly: number;
  competition: KeywordCompetitionLevel;
  competitionIndex: number;
}

export interface KeywordIdeaMetrics {
  monthly_search_volumes: Array<{
    month: string;
    year: string;
    monthly_searches: string;
  }>;
  competition: string;
  avg_monthly_searches: string;
  competition_index: string;
  low_top_of_page_bid_micros: string;
  high_top_of_page_bid_micros: string;
}

export interface KeywordAnnotation {
  concepts: Array<{
    name: string;
    concept_group: {
      name: string;
      type: string;
    };
  }>;
}

export interface KeywordIdea {
  keyword_idea_metrics: KeywordIdeaMetrics;
  keyword_annotations: KeywordAnnotation;
  text: string;
}

interface BaseKeywordPlanRequest {
  customer_id: string;
  language: string;
  geo_target_constants: string[];
  include_adult_keywords: boolean;
  keyword_plan_network: enums.KeywordPlanNetwork;
  page_size: number;
  page_token: string;
  keyword_annotation: enums.KeywordPlanKeywordAnnotation[];
  keyword_and_url_seed?: services.IKeywordAndUrlSeed;
  keyword_seed?: services.IKeywordSeed;
  url_seed?: services.IUrlSeed;
  site_seed?: services.ISiteSeed;
  toJSON(): object;
}

// Initialize the client
const initializeClient = () => {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const refreshToken = process.env.GOOGLE_ADS_API_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !developerToken || !refreshToken) {
    throw new Error('Missing required Google Ads API credentials');
  }

  return new GoogleAdsApi({
    client_id: clientId,
    client_secret: clientSecret,
    developer_token: developerToken,
  });
}

const client = initializeClient();

// Initialize customer
const customer = client.Customer({
  customer_id: CUSTOMER_ID,
  refresh_token: process.env.GOOGLE_ADS_API_REFRESH_TOKEN!,
});

export const getCustomers = async () => {
  try {
    const refreshToken = process.env.GOOGLE_ADS_API_REFRESH_TOKEN;
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }
    return await client.listAccessibleCustomers(refreshToken).catch((error) => {
      console.error('Error fetching customers:', error);
      throw error;
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

export const getKeywordPlans = async (request: KeywordPlanRequestDTO): Promise<services.GenerateKeywordIdeaResponse> => {
  try {
    const planRequest: BaseKeywordPlanRequest = {
      customer_id: CUSTOMER_ID,
      language: 'languageConstants/1000',
      geo_target_constants: ['geoTargetConstants/2840'],
      include_adult_keywords: false,
      keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH,
      keyword_annotation: [enums.KeywordPlanKeywordAnnotation.KEYWORD_CONCEPT],
      page_size: 50,
      page_token: '',
      toJSON() { return this; }
    };

    switch (request.requestType) {
      case 'keywordAndUrlSeed':
        if (!request.keywords || !request.url) {
          throw new Error('Keywords and URL required for keywordAndUrlSeed');
        }
        planRequest.keyword_and_url_seed = {
          keywords: request.keywords,
          url: request.url
        };
        break;
      case 'keywordSeed':
        if (!request.keywords) {
          throw new Error('Keywords required for keywordSeed');
        }
        planRequest.keyword_seed = {
          keywords: request.keywords
        };
        break;
      case 'urlSeed':
        if (!request.url) {
          throw new Error('URL required for urlSeed');
        }
        planRequest.url_seed = {
          url: request.url
        };
        break;
      case 'siteSeed':
        if (!request.url) {
          throw new Error('URL required for siteSeed');
        }
        planRequest.site_seed = {
          site: request.url
        };
        break;
    }

    console.log('making request', planRequest);
    const response = await customer.keywordPlanIdeas.generateKeywordIdeas(planRequest).catch((error) => {
      console.error('Error generating keyword ideas:', error);
      throw error;
    });

    return response

  } catch (error) {
    console.error('Error generating keyword ideas:', error);
    throw error;
  }
}