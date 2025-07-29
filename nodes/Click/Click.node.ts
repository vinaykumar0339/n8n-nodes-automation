import { ApplicationError, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType, NodeExecutionWithMetadata } from "n8n-workflow";
import { ElementIdentifier, elementSelectProperties } from "../../utils";

export class Click implements INodeType {
    description: INodeTypeDescription = {
        displayName: "Click",
        name: "click",
        icon: "file:click.svg",
        group: ["transform"],
        version: 1,
        description: "Simulates a click action",
        defaults: {
            name: "Click",
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        properties: [
            ...elementSelectProperties
        ],
    }

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
        const flowContext = this.getContext('flow');
        const appiumDriver = flowContext.appiumDriver as WebdriverIO.Browser;
        const elementSelectorsById = flowContext.elementSelectorsById as Record<string, ElementIdentifier>;

        if (!appiumDriver) {
            throw new ApplicationError("Appium driver is not initialized. Please run the Driver Init node first.");
        }
        const elementSelectorId = this.getNodeParameter("elementSelectorId", 0) as string;
        const elementSelector = elementSelectorsById[elementSelectorId];
        if (!elementSelector) {
            throw new ApplicationError(`Element selector not found: ${elementSelectorId} Please ensure the Driver Init node has been executed and the element selector ID is correct.`);
        }
        const androidSelectorType = elementSelector.androidSelectorType;
        const androidSelectorValue = elementSelector.androidSelectorValue;
        const iosSelectorType = elementSelector.iosSelectorType;
        const iosSelectorValue = elementSelector.iosSelectorValue;
        const isAndroid = appiumDriver.isAndroid;
        const selectorType = isAndroid ? androidSelectorType : iosSelectorType;
        const selectorValue = isAndroid ? androidSelectorValue : iosSelectorValue;

        let element;
        if (selectorType == "xpath") {
            element = appiumDriver.$(`${selectorValue}`);
        } else if (selectorType == "css") {
            element = appiumDriver.$(`${selectorValue}`);
        } else if (selectorType == "id") {
            element = appiumDriver.$(`#${selectorValue}`);
        } else if (selectorType == "className") {
            element = appiumDriver.$(`.${selectorValue}`);
        } else if (selectorType == "tagName") {
            element = appiumDriver.$(`${selectorValue}`);
        } else if (selectorType == "accessibilityId") {
            element = appiumDriver.$(`~${selectorValue}`);
        } else {
            throw new ApplicationError(`Unsupported selector type: ${selectorType}`);
        }

        await element.click();

        return [[{ json: { message: "Click action performed successfully", elementData: {
            text: await element.getText(),
        } } }]];
    }
}