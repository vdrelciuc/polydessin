export interface Filter {
  name: string;
  referenceID: string;
  imagePath?: string;
}

export const FilterList: Filter[] = [
  {name: 'Filtre 1', referenceID: 'filter0'},
  {name: 'Filtre 2', referenceID: 'filter2'},
  {name: 'Filtre 3', referenceID: 'displacementFilter'},
  {name: 'Filtre 4', referenceID: 'filter5'},
  {name: 'Filtre 5', referenceID: 'filter3'}
]
