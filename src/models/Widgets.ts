import mongoose, { Document, Schema } from 'mongoose';



// Define common widget schema
const WidgetSchema: Schema = new Schema({
    title: {type: String},
    type: { type: String, required: true },
    code: {type: String, required: true},
    content: { type: Schema.Types.Mixed, required: true },
    settings: { type: Schema.Types.Mixed, required: true }
});

// Define widget interface
export interface IWidget extends Document {
    title: string,
    type: string;
    code: string,
    content: any;
    settings: any;
}

export interface SliderWidget extends IWidget {
    type: 'Slider';
    code: string,
    content: { slides: Array<{ image: string; text: string }> };
    settings: { autoPlay: boolean; duration: number };
}

export interface CTABannerWidget extends IWidget {
    type: 'Cta Banner';
    code: string,
    content: { message: string; buttonText: string; buttonLink: string };
    settings: { backgroundColor: string; textColor: string };
}

export interface CDTWidget extends IWidget {
    type: 'Count Down Timer',
    code: string,
    content: { 
        startTime: string; 
        buttonText: string; 
        timeZone: string;
        position: string;
        message: string,
        buttonLink: string,
    };
    settings: { 
        backgroundColor: string; 
        textColor: string,
        countDisplay: Record<string, {isActive: boolean, lable: string}>,
        actionAfterComplete: {
            showMesage: {
                isActive: boolean,
                message: string,
                showCounter: boolean,
                showButton: boolean,
                buttonLink: string,
                buttonText: string
            },
            hideTimer: {
                isActive: boolean
            },
        },
        appearence: {
            colors: {
                timerColor: string,
                lablesColor: string,
                messageColor: string,
                buttonColor: string,
                bgColor: string
            }
        }
    };
}



export interface MarketingPopupWidget extends IWidget {
    type: 'Popup';
    code: string,
    content: { title: string; message: string; link: string };
    settings: { displayFrequency: number };
}

// Union type for all widget types
export type AllWidgets = SliderWidget | CTABannerWidget | MarketingPopupWidget;

const Widget = mongoose.model<IWidget>('Widget', WidgetSchema);

export default Widget;

