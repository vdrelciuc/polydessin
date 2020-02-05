export interface Filter {
  name: string;
  referenceID: string;
  imagePath?: string;
}
/*
export const Filters: string[] = [
  'filter0',
  'displacementFilter',
  'filter2',
  'filter5',
  'filter3'
]*/

export const FilterList: Filter[] = [
  {name: 'Filtre 1', referenceID: 'filter0'},
  {name: 'Filtre 2', referenceID: 'filter2'},
  {name: 'Filtre 3', referenceID: 'displacementFilter'},
  {name: 'Filtre 4', referenceID: 'filter5'},
  {name: 'Filtre 5', referenceID: 'filter3'}
]
