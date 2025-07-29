import { INodeProperties } from 'n8n-workflow';

export const loadElementSelectorProperties: INodeProperties[] = [
    {
        displayName: 'Google Sheet ID',
        name: 'sheetId',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'Enter Google Sheet ID',
        description: 'The ID of the Google Sheet containing element locators',
    },
    {
        displayName: 'Sheet Number',
        name: 'sheetNameNumber',
        type: 'number',
        required: true,
        default: 0,
        placeholder: 'Enter Sheet Number',
        description: 'The number of the sheet in the Google Sheet (0 for first sheet)',
    }
]

export const elementSelectProperties: INodeProperties[] = [
    {
        displayName: 'Element Selector Id',
        name: 'elementSelectorId',
        type: 'string',
		default: '',
		description: 'Provide the element selector Id from the previous step',
	},
];
