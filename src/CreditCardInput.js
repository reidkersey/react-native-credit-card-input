import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules,
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  ViewPropTypes,
} from "react-native";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  form: {
    marginTop: 0,
  },
  inputContainer: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
  },
  inputContainerBelow: {
    marginTop: 0,
  },
  inputRight: {
    marginRight: 0,
  },
  inputLeft: {
    marginLeft: 0,
  },
  lastLine: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    height: 0,
  },
  inputMiddle: {
    marginTop: 0,
  },
});

/* eslint react/prop-types: 0 */ export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(
      PropTypes.shape(TextInput.propTypes),
    ),

    style: ViewPropTypes.style,
    cardNumberInputStyle: ViewPropTypes.style,
    expirationInputStyle: ViewPropTypes.style,
    cvcInputStyle: ViewPropTypes.style,
    zipInputStyle: ViewPropTypes.style,
    nameInputStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "Cardholder's Name",
      number: "Card Number",
      expiry: "Expiration",
      cvc: "CVC",
      postalCode: "Zip Code",
    },
    placeholders: {
      name: "Full Name",
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "34567",
    },
    inputContainerStyle: {
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
    style: {},
    cardNumberInputStyle: {},
    expirationInputStyle: {},
    cvcInputStyle: {},
    zipInputStyle: {},
    nameInputStyle: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = (newProps) => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = (field) => {
    if (!field) return;

    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(
      nodeHandle,
      (e) => {
        throw e;
      },
      (x) => {
        this.refs[field].focus();
      },
    );
  };

  _inputProps = (field) => {
    const {
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      labels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    const {
      cardImageFront,
      cardImageBack,
      inputContainerStyle,
      values: {
        number, expiry, cvc, name, type,
      },
      focused,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      cardScale,
      cardFontFamily,
      cardBrandIcons,
      style,
      cardNumberInputStyle,
      expirationInputStyle,
      cvcInputStyle,
      zipInputStyle,
      nameInputStyle,
    } = this.props;
    let rightStyle = {};
    if (!requiresPostalCode) {
      rightStyle = s.inputRight;
    }
    return (
      <View style={[
        s.container,
        style,
      ]}>
        <CreditCard
          focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc} />
        <View
          ref="Form"
          style={{
            flexDirection: "column",
            width: Dimensions.get('window').width - 40,
          }}>
          <View style={{
            flexDirection: "row",
          }}>
            <View style={{ flex: 1 }}>
              <CCInput
                {...this._inputProps("number")}
                keyboardType="numeric"
                containerStyle={[
                  s.inputContainer,
                  inputContainerStyle,
                  cardNumberInputStyle,
                ]}
                rightIcon={{ type: "font-awesome", name: "lock", color: "#3B7C44" }} />
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
              }}>
              <CCInput
                {...this._inputProps("expiry")}
                keyboardType="numeric"
                containerStyle={[
                  s.inputLeft,
                  inputContainerStyle,
                  s.inputMiddle,
                  expirationInputStyle,
                ]} />
            </View>

            {requiresCVC && (
              <View style={{ flex: 1 }}>
                <CCInput
                  {...this._inputProps("cvc")}
                  keyboardType="numeric"
                  containerStyle={[
                    inputContainerStyle,
                    rightStyle,
                    s.inputMiddle,
                    cvcInputStyle,
                  ]} />
              </View>
            )}

            {requiresPostalCode && (
              <View style={{ flex: 1 }}>
                <CCInput
                  {...this._inputProps("postalCode")}
                  keyboardType="numeric"
                  containerStyle={[
                    s.inputRight,
                    s.inputMiddle,
                    inputContainerStyle,
                    zipInputStyle,
                  ]} />
              </View>
            )}
          </View>
          {requiresName && (
            <View>
              <CCInput
                {...this._inputProps("name")}
                containerStyle={[
                  s.lastLine,
                  inputContainerStyle,
                  nameInputStyle,
                ]} />
            </View>
          )}
        </View>
      </View>
    );
  }
}
