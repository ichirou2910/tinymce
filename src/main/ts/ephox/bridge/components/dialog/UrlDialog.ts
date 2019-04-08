import { FieldSchema, ValueSchema } from '@ephox/boulder';
import { Fun, Option, Result } from '@ephox/katamari';
import { DialogButton, DialogButtonApi, dialogButtonFields } from './Dialog';

export interface UrlDialogInstanceApi {
  block: (msg: string) => void;
  unblock: () => void;
  close: () => void;
}

export interface UrlDialogActionDetails {
  name: string;
  value?: any;
}

export type UrlDialogActionHandler = (api: UrlDialogInstanceApi, actions: UrlDialogActionDetails) => void;
export type UrlDialogCloseHandler = () => void;
export type UrlDialogCancelHandler = (api: UrlDialogInstanceApi) => void;

// Allow the same button structure as dialogs, but remove the ability to have submit buttons
export interface UrlDialogButtonApi extends DialogButtonApi {
  type: 'cancel' | 'custom';
}

// Allow the same button structure as dialogs, but remove the ability to have submit buttons
export interface UrlDialogButton extends DialogButton {
  type: 'cancel' | 'custom';
}

export interface UrlDialogApi {
  title: string;
  url: string;
  height?: number;
  width?: number;
  buttons?: UrlDialogButtonApi[];

  // Gets fired when a custom button is clicked
  onAction?: UrlDialogActionHandler;

  // Gets fired when the dialog is closed for any reason
  onClose?: UrlDialogCloseHandler;

  // Gets fired when the dialog is manually closed using Esc key or cancel/X button
  onCancel?: UrlDialogCancelHandler;
}

export interface UrlDialog {
  title: string;
  url: string;
  height: Option<number>;
  width: Option<number>;
  buttons: Option<UrlDialogButton[]>;

  onAction: UrlDialogActionHandler;
  onClose: UrlDialogCloseHandler;
  onCancel: UrlDialogCancelHandler;
}

export const urlDialogButtonSchema = ValueSchema.objOf([
  FieldSchema.strictStringEnum('type', ['cancel', 'custom']),
  ...dialogButtonFields
]);

export const urlDialogSchema = ValueSchema.objOf([
  FieldSchema.strictString('title'),
  FieldSchema.strictString('url'),
  FieldSchema.optionNumber('height'),
  FieldSchema.optionNumber('width'),
  FieldSchema.optionArrayOf('buttons', urlDialogButtonSchema),
  FieldSchema.defaultedFunction('onAction', Fun.noop),
  FieldSchema.defaultedFunction('onCancel', Fun.noop),
  FieldSchema.defaultedFunction('onClose', Fun.noop)
]);

export const createUrlDialog = (spec: UrlDialogApi): Result<UrlDialog, ValueSchema.SchemaError<any>> => {
  return ValueSchema.asRaw('dialog', urlDialogSchema, spec);
};
