export interface ElementIdentifier {
    id: string;
    androidSelectorType: 'className' | 'css' | 'id' | 'tagName' | 'xpath';
    androidSelectorValue: string;
    iosSelectorType: 'accessibilityId' | 'className' | 'id' | 'xpath';
    iosSelectorValue: string;
}