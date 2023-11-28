// TypeScript - type declaration file

export type Icons = {
  div: string;
  button: string;
  form: string;
  img: string;
  link: string;
  'list-item': string;
  paragraph: string;
  'list-ol': string;
  'list-ul': string;
  input: string;
  navbar: string;
};

export type HtmlElementMap = {
  div: string[];
  button: string[];
  form: string[];
  img: string[];
  link: string[];
  'list-item': string[];
  paragraph: string[];
  'list-ol': string[];
  'list-ul': string[];
  input: string[];
  navbar: string[];
};

export type Component = {
  componentName: string;
  children: string[];
  htmlList: HtmlList;
  isActive?: boolean;
  x?: number;
  y?: number;
  h?: number;
  w?: number;
  id?: number;
};
export type ComponentMap = {
  [k: string]: Component;
};

export type Routes = {
  [k: string]: string[];
};

export type Project = {
  filename: string;
  lastSavedLocation: string;
};
export type Type = string;

export type State = {
  icons: Icons;
  htmlElementMap: HtmlElementMap;
  componentMap: ComponentMap;
  routes: Routes;
  componentNameInputValue: string;
  activeRoute: string;
  activeComponent: string;

  activeElement: string; //new
  componentIndex: number; //new
  elementIndex: number; //new

  projectName: string;
  selectedElementList: object[];
  componentChildrenMultiselectValue: string[];
  modalOpen: boolean;
  htmlElements: any[];
  saved: boolean;
  loggedIn: boolean;
  rerenderKey: number;

  arrayOfStates: Array<object>;
};

// export type StateQueue = State[]

export type Mutations<State> = {
  [k: Type]: (
    state: State,
    payload?: any,
    elementName?: string,
    id?: number
  ) => void;
};
export type Actions = {
  [k: Type]: (context: any, payload?: any) => void;
};

export type HtmlChild = {
  text: string;
  children: HtmlChild[];
  _id?: number;
  x?: number;
  y?: number;
  w?: number; 
  h?: number; 
};

export type HtmlList = HtmlChild[];
