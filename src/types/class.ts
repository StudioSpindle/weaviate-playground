export type ClassLocation = 'Local' | 'Network';
export type ClassType = 'All' | 'Things' | 'Actions';
export interface IKeyword {
  keyword: string;
  weight: number;
}

export type Keywords = IKeyword[];
