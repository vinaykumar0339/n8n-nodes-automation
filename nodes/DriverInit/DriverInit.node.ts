import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType, NodeExecutionWithMetadata } from "n8n-workflow";
import { remote } from 'webdriverio';

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
        properties: [],
    }

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
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

        return [[{ json: { message: "Driver initialized successfully" } }]];
    }
}