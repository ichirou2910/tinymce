import { Fun } from '@ephox/katamari';
import { Option } from '@ephox/katamari';
import Compare from './Compare';
import Element from '../node/Element';
import PredicateExists from '../search/PredicateExists';
import Traverse from '../search/Traverse';

var focus = function (element) {
  element.dom().focus();
};

var blur = function (element) {
  element.dom().blur();
};

var hasFocus = function (element) {
  var doc = Traverse.owner(element).dom();
  return element.dom() === doc.activeElement;
};

var active = function (_doc) {
  var doc = _doc !== undefined ? _doc.dom() : document;
  return Option.from(doc.activeElement).map(Element.fromDom);
};

var focusInside = function (element) {
  // Only call focus if the focus is not already inside it.
  var doc = Traverse.owner(element);
  var inside = active(doc).filter(function (a) {
    return PredicateExists.closest(a, Fun.curry(Compare.eq, element));
  });

  inside.fold(function () {
    focus(element);
  }, Fun.noop);
};

/**
 * Return the descendant element that has focus.
 * Use instead of SelectorFind.descendant(container, ':focus')
 *  because the :focus selector relies on keyboard focus.
 */
var search = function (element) {
  return active(Traverse.owner(element)).filter(function (e) {
    return element.dom().contains(e.dom());
  });
};

export default <any> {
  hasFocus: hasFocus,
  focus: focus,
  blur: blur,
  active: active,
  search: search,
  focusInside: focusInside
};