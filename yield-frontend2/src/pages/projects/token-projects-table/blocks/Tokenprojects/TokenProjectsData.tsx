interface IProjectsData {
  project: {
    url: string;
    name: string;
    id: string;
  };
  raise: string;
  symbol: string;
  stage: {
    label: string;
    color: string;
  };
  base: string;
  flag: string;
  blurb: string;
}

const ProjectsData: IProjectsData[] = [
  {
    project: {
      url: '300-1.png',
      name: 'Modelex.AI',
      id: 'id'
    },
    raise: '$1M',
    symbol: '$AI',
    stage: {
      label: 'Pre-Seed',
      color: 'primary'
    },
    base: 'BVI',
    flag: 'british-virgin-islands.svg',
    blurb:
      'Modelex AI empowers organizations to make their AI models smarter through self-organizing, ad hoc, distributed infrastructure, enabling rapid innovation, monetization and enhanced decision-making'
  },
  {
    project: {
      url: '300-1.png',
      name: 'RAMM',
      id: 'id'
    },
    raise: '$500K',
    symbol: '$RAMM',
    stage: {
      label: 'Seed',
      color: 'primary'
    },
    base: 'Canada',
    flag: 'canada.svg',
    blurb: 'RAMM tokenizes retail real-world assets'
  }
];

export { ProjectsData, type IProjectsData };
