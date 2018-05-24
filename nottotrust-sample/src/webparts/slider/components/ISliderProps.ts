import { ISliderWebPartProps } from "../SliderWebPart";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISliderProps extends ISliderWebPartProps {
  context: WebPartContext;
}

export interface ISliderState {
  loading: boolean;
}
