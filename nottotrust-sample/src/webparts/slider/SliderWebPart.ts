import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SliderWebPartStrings';
import Slider from './components/Slider';
import { ISliderProps } from './components/ISliderProps';

import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';

export interface ISliderWebPartProps {
  collectionData: any[];
  interval: number;
}

export default class SliderWebPart extends BaseClientSideWebPart<ISliderWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISliderProps > = React.createElement(
      Slider,
      {
        collectionData: this.properties.collectionData,
        interval: this.properties.interval || 2,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyFieldCollectionData("collectionData", {
                  key: "collectionData",
                  label: "News highlights",
                  panelHeader: "News highlights configuration",
                  manageBtnLabel: "Manage news highlights",
                  value: this.properties.collectionData,
                  fields: [
                    {
                      id: "title",
                      title: "Title",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "description",
                      title: "Description",
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: "image",
                      title: "Image URL",
                      type: CustomCollectionFieldType.string
                    }
                  ]
                }),
                PropertyFieldNumber("interval", {
                  key: "interval",
                  label: "Slideshow interval",
                  value: this.properties.interval,
                  maxValue: 10,
                  minValue: 1,
                  disabled: false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
