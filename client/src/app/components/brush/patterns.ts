export interface Filter {
  name: string;
  referenceID: string;
  imagePath: string;
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
  {name: 'Filtre 1', referenceID: 'filter0', imagePath: 'none'},
  {name: 'Filtre 2', referenceID: 'filter2', imagePath: 'none'},
  {name: 'Filtre 3', referenceID: 'displacementFilter', imagePath: 'none'},
  {name: 'Filtre 4', referenceID: 'filter5', imagePath: 'none'},
  {name: 'Filtre 5', referenceID: 'filter3', imagePath: 'none'},
]
