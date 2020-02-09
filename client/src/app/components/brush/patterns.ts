export interface Filter {
  name: string;
  referenceID: string;
  imagePath: string;
}

export const FilterList: Filter[] = [
  {name: 'Filtre 1', referenceID: 'filter0', imagePath: '../../../assets/filters/filter1.PNG'},
  {name: 'Filtre 2', referenceID: 'filter2', imagePath: '../../../assets/filters/filter2.PNG'},
  {name: 'Filtre 3', referenceID: 'displacementFilter', imagePath: '../../../assets/filters/filter3.PNG'},
  {name: 'Filtre 4', referenceID: 'filter5', imagePath: '../../../assets/filters/filter4.PNG'},
  {name: 'Filtre 5', referenceID: 'filter3', imagePath: '../../../assets/filters/filter5.PNG'}
]
