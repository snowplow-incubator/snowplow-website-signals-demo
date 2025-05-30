export interface AttributeItem {
    name: string
    value: string | number
}

export type InterventionStatusDict = {
  triggered_tour?: boolean;
  key_visits?: boolean;
  visited_contact?: boolean;
  contact_page_landing?: boolean;
  demo_complete?: boolean;
  [key: string]: boolean | undefined;
};