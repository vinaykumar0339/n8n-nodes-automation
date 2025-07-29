import { ApplicationError, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType, NodeExecutionWithMetadata } from "n8n-workflow";

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
            // Android properties
            {
                displayName: "Android Selector Type",
                name: "androidSelectorType",
                type: "options",
                placeholder: "Select Android selector type",
                required: true,
                options: [
                    { name: "Class Name", value: "className" },
                    { name: "CSS Selector", value: "css" },
                    { name: "ID", value: "id" },
                    { name: "Tag Name", value: "tagName" },
                    { name: "XPath", value: "xpath" }
                ],
                default: "id",
                description: "How to select the element on Android",
            },
            {
                displayName: "Android Selector Value",
                name: "androidSelectorValue",
                type: "string",
                required: true,
                placeholder: "Enter Android selector value",
                default: "",
                description: "Value for the selected Android selector type",
            },
            // iOS properties
            {
                displayName: "iOS Selector Type",
                name: "iosSelectorType",
                required: true,
                placeholder: "Select iOS selector type",
                type: "options",
                options: [
                    { name: "Accessibility ID", value: "accessibilityId" },
                    { name: "Class Name", value: "className" },
                    { name: "ID", value: "id" },
                    { name: "XPath", value: "xpath" }
                ],
                default: "accessibilityId",
                description: "How to select the element on iOS",
            },
            {
                displayName: "iOS Selector Value",
                name: "iosSelectorValue",
                required: true,
                placeholder: "Enter iOS selector value",
                type: "string",
                default: "",
                description: "Value for the selected iOS selector type",
            }
        ],
    }

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
        const flowContext = this.getContext('flow');
        const appiumDriver = flowContext.appiumDriver as WebdriverIO.Browser;

        if (!appiumDriver) {
            throw new ApplicationError("Appium driver is not initialized. Please run the Driver Init node first.");
        }
        const androidSelectorType = this.getNodeParameter("androidSelectorType", 0) as string;
        const androidSelectorValue = this.getNodeParameter("androidSelectorValue", 0) as string;
        const iosSelectorType = this.getNodeParameter("iosSelectorType", 0) as string;
        const iosSelectorValue = this.getNodeParameter("iosSelectorValue", 0) as string;
        const isAndroid = appiumDriver.isAndroid;
        const selectorType = isAndroid ? androidSelectorType : iosSelectorType;
        const selectorValue = isAndroid ? androidSelectorValue : iosSelectorValue;

        let element;
        if (selectorType == "xpath") {
            element = appiumDriver.$(`//${selectorValue}`);
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