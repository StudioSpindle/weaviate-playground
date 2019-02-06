export interface ID3Node {
  id: string;
  group: number;
  highlighted?: boolean;
}

export interface ID3Link {
  isActive: boolean;
  source: string;
  target: string;
  value: number;
}

export interface ID3Graph {
  nodes: ID3Node[];
  links: ID3Link[];
}
