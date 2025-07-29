import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType, NodeExecutionWithMetadata } from "n8n-workflow";
import { remote } from 'webdriverio';
import { loadElementSelectorProperties } from "../../utils";
import csv from 'csvtojson';

export class DriverInit implements INodeType {
    description: INodeTypeDescription = {
        displayName: "Driver Init",
        name: "driverInit",
        icon: "file:driverInit.svg",
        group: ["transform"],
        version: 1,
        description: "Initializes the driver for the workflow",
        defaults: {
            name: "Driver Init",
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        properties: [
            ...loadElementSelectorProperties
        ],
    }

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
        const sheetId = this.getNodeParameter("sheetId", 0) as string;
        const sheetNameNumber = this.getNodeParameter("sheetNameNumber", 0) as number;
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${sheetNameNumber}`
        const response = await this.helpers.request({
            url: url,
            method: 'GET',
        })
        console.log(`CSV Response: ${response}`);
        const jsonObj = await csv().fromString(response);
        // Convert array of objects to an object with key as 'id' and value as the object (excluding 'id')
        const elementSelectorsById = jsonObj.reduce((acc: Record<string, any>, item: any) => {
            if (item.id) {
                acc[item.id] = item;
            }
            return acc;
        }, {});
        console.log(`Parsed JSON: ${JSON.stringify(elementSelectorsById, null, 2)}`);



        const appiumDriver = await remote({
            hostname: 'localhost',
            port: 4723,
            capabilities: {
                "appium:appActivity": "in.vymo.android.base.splashRoute.SplashRouterActivity",
                "appium:appPackage": "com.getvymo.android.debug",
                "appium:automationName": "UiAutomator2",
                "appium:deviceName": "Android Device",
                "appium:forceAppLaunch": false,
                "appium:noReset": false,
                "appium:udid": "emulator-5554",
                "platformName": "Android",
                "appium:optionalIntentArguments": "-e appiumTest true",
                "appium:autoGrantPermissions": true
            }
        });

        const flowContext = this.getContext('flow');

        flowContext.appiumDriver = appiumDriver;
        flowContext.elementSelectorsById = elementSelectorsById;

        return [[{ json: { message: "Driver initialized successfully", elementSelectors: elementSelectorsById } }]];
    }
}