import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'DocumentsOverviewWebPartStrings';
import DocumentsOverview from './components/DocumentsOverview';
import { IDocumentsOverviewProps } from './components/IDocumentsOverviewProps';

export interface IDocumentsOverviewWebPartProps {
  description: string;
}

export default class DocumentsOverviewWebPart extends BaseClientSideWebPart<IDocumentsOverviewWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDocumentsOverviewProps > = React.createElement(
      DocumentsOverview,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
