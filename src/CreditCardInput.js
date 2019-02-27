import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules,
  View,
  Text,
  StyleSheet,
  TextInput,
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
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 5,
    marginRight: 20,
    marginLeft: 20,
  },
  inputContainerBelow: {
    marginTop: 10,
  },
  inputRight: {
    marginRight: 20,
  },
  inputLeft: {
    marginLeft: 20,
  },
  lastLine: {
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,
  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
  },
  inputMiddle: {
    marginTop: 10,
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
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: "CARD NUMBER",
      expiry: "EXPIRY",
      cvc: "CVC/CCV",
      postalCode: "ZIP CODE",
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
            width: 400,
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
                ]} />
            </View>
          )}
        </View>
      </View>
    );
  }
}
