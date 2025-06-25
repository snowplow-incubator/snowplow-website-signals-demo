export interface AttributeItem {
    name: string
    value: string | number
}

export type InterventionStatusDict = {
  waited_on_landing_page?: boolean;
  customers_page_viewed?: boolean;
  demo_complete?: boolean;
  [key: string]: boolean | undefined;
};