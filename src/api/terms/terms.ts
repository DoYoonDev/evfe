import { defaultAxios } from '@/config/api';
import { END_POINTS } from '@/constants/api';
import type { Terms } from '@/types/terms/terms.ts';

export const getTos = async (langCd: string): Promise<Terms> => {
    const response = await defaultAxios.get(`${END_POINTS.TERMS}/getTos?langCd=${langCd}`);
    
    return response.data;
};

export const getTop = async (langCd: string): Promise<Terms> => {
    const response = await defaultAxios.get(`${END_POINTS.TERMS}/getTop?langCd=${langCd}`);
    
    return response.data;
}
