import * as React from 'react';
import styles from './DocumentsOverview.module.scss';
import { IDocumentsOverviewProps } from './IDocumentsOverviewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { List } from 'office-ui-fabric-react/lib/List';
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, DocumentCardType } from 'office-ui-fabric-react/lib/DocumentCard';
import { ImageFit } from 'office-ui-fabric-react/lib/Image';
import { BrandIcons } from './BrandIcons';
import SearchService from '../SearchService';
import * as strings from 'DocumentsOverviewWebPartStrings';
import { HttpClient } from '@microsoft/sp-http';

export default class DocumentsOverview extends React.Component<IDocumentsOverviewProps, {recentDocs: any[]}> {
  private searchService: SearchService = null;

  constructor(props: IDocumentsOverviewProps) {
    super(props);

    this.searchService = new SearchService(props.context);

    this.state = { recentDocs: [] };
  }

  public componentDidMount(): void {
    this.retrieveDocuments();
  }

  /**
   * Get all documents
   */
  private async retrieveDocuments() {
    const qResult = await this.searchService.get('fileextension:docx', 10, null, true, true, null, ["Path", "Title", "FileExtension", "ServerRedirectedPreviewURL", "Author", "LastModifiedTime"]);
    if (qResult && qResult.results && qResult.results.length > 0) {
      this.setState({
        recentDocs: qResult.results
      });
    }
  }

  /**
   * Renders the list cell
   */
  private onRenderCell = (item: any, index: number | undefined): JSX.Element => {
    // Create the preview image properties
    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          name: item.Title,
          url: item.Path,
          previewImageSrc: item.ServerRedirectedPreviewURL,
          iconSrc: BrandIcons[item.FileExtension],
          imageFit: ImageFit.cover,
          width: 318,
          height: 196
        }
      ],
    };

    this.passInformation(item);

    // Return a document card for the retrieved item
    return (
      <div className={styles.document}>
        <DocumentCard onClickHref={item.Path}
                      type={DocumentCardType.compact}>
          <div className={styles.documentPreview}>
            <DocumentCardPreview  {...previewProps} />
          </div>
          <div className={styles.documentDetails}>
            <DocumentCardTitle title={item.Title} shouldTruncate={true} />
            <DocumentCardActivity activity={`Last modified: ${this.relativeDate(item.LastModifiedTime)}`}
                                  people={[{
                                    name: item.Author,
                                    profileImageSrc: ""
                                  }]} />
          </div>
        </DocumentCard>
      </div>
    );
  }

  /**
   * Returns the relative date for the document activity
   */
  private relativeDate(crntDate: string): string {
    const date = new Date((crntDate || "").replace(/-/g,"/").replace(/[TZ]/g," "));
    const diff = (((new Date()).getTime() - date.getTime()) / 1000);
    const day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0) {
      return;
    }

    return day_diff === 0 && (
           diff < 60 && strings.DateJustNow ||
           diff < 120 && strings.DateMinute ||
           diff < 3600 && `${Math.floor( diff / 60 )} ${strings.DateMinutesAgo}` ||
           diff < 7200 && strings.DateHour ||
           diff < 86400 && `${Math.floor( diff / 3600 )} ${strings.DateHoursAgo}`) ||
           day_diff == 1 && strings.DateDay ||
           day_diff <= 30 && `${day_diff} ${strings.DateDaysAgo}` ||
           day_diff > 30 && `${Math.ceil(day_diff / 7)} ${strings.DateWeeksAgo}`;
  }

  private async passInformation(item: any) {
    await this.props.context.httpClient.post("https://ecs-itpro-fncs.azurewebsites.net/api/LogDocument", HttpClient.configurations.v1, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        item
      })
    });
  }

  public render(): React.ReactElement<IDocumentsOverviewProps> {
    return (
      <div className={ styles.documentsOverview }>
        <List items={this.state.recentDocs}
              renderedWindowsAhead={4}
              onRenderCell={this.onRenderCell} />
      </div>
    );
  }
}
