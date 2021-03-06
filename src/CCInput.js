import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes,
} from "react-native";
import { Input as TI } from "react-native-elements";

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(["valid", "invalid", "incomplete"]),

    containerStyle: ViewPropTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
    additionalInputProps: PropTypes.any,

    rightIcon: PropTypes.object,
    leftIcon: PropTypes.object,
    textboxProps: PropTypes.any,
  };

  static defaultProps = {
    label: "",
    value: "",
    status: "incomplete",
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => { },
    onChange: () => { },
    onBecomeEmpty: () => { },
    onBecomeValid: () => { },
    additionalInputProps: {},
    rightIcon: null,
    leftIcon: null,
    textboxProps: null,
  };

  componentWillReceiveProps = newProps => {
    const { status, value, onBecomeEmpty, onBecomeValid, field } = this.props;
    const { status: newStatus, value: newValue } = newProps;

    if (value !== "" && newValue === "") onBecomeEmpty(field);
    if (status !== "valid" && newStatus === "valid") onBecomeValid(field);
  };

  focus = () => this.refs.input.focus();

  _onFocus = () => this.props.onFocus(this.props.field);
  _onChange = value => this.props.onChange(this.props.field, value);

  render() {
    const { label, value, placeholder, status, keyboardType,
      containerStyle, inputStyle,
      validColor, invalidColor, placeholderColor, rightIcon,
      leftIcon, additionalInputProps, textboxProps } = this.props;
    return (
      <TouchableOpacity onPress={this.focus}
        activeOpacity={0.99}>
        <TI ref="input"
          containerStyle={[containerStyle]}
          labelStyle={{
            paddingLeft: 10,
            color: "#222",
            fontWeight: "100",
            fontSize: 14,
          }}
          inputStyle={{
            paddingLeft: 15,
            fontSize: 18,
            paddingTop: 3,
            paddingBottom: 3,
          }}
          inputContainerStyle={{
            borderRadius: 4,
            borderWidth: 0.5,
            borderColor: "#d6d7da",
          }}
          rightIconContainerStyle={{
            marginRight: 15,
          }}
          rightIcon={rightIcon}
          leftIcon={leftIcon}
          label={label}
          {...additionalInputProps}
          keyboardType={keyboardType}
          autoCapitalise="words"
          autoCorrect={false}
          underlineColorAndroid={"transparent"}
          placeholderTextColor={placeholderColor}
          placeholder={placeholder}
          value={value}
          onFocus={this._onFocus}
          onChangeText={this._onChange}
          {...textboxProps} />
      </TouchableOpacity>
    );
  }
}
