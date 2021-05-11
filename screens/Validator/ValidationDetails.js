import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    KeyboardAvoidingView,
} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class ValidationDetails extends Component{

    constructor(){
        super()
        this.state = {
          ticketData: ' ',
          redeemTicketNo: '',
          validatorData: {},
          btnState: false,
          validated: [],
        }
      }

    static navigationOptions = ({ navigation }) => {
        return{
            title: 'Code Details',
            headerStyle: {
                backgroundColor: '#2c3e50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: SCREEN_WIDTH * 0.05,
                fontFamily: 'Arial',
            },
            headerRight : null,
          }
    }

    componentDidMount(){
      global.trigger = this;
      const redeemTicket = this.props.navigation.state.params ? this.props.navigation.state.params.redeemTicket : null;
      if(redeemTicket != null){
          this.setState({ticketData: this.props.navigation.state.params.redeemTicket});
          this.setState({validatorData: this.props.navigation.state.params.validator});
          this.setState({validated: this.props.navigation.state.params.redeemTicket.validationDetails});
      }
    }

    componentDidUpdate(){
      global.trigger = this;
      NetInfo.isConnected.fetch().then(isConnected => {
      if(!isConnected){
          setTimeout(()=>{
          this.props.navigation.navigate("ValNoInternet", {validator: this.state.validatorData});
          },
          1000);
      }
      });
    }

    render(){
        return(
            <DismissKeyboard>
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "position" : null}>
                    <ScrollView>
                        <StatusBar hidden={false} barStyle='light-content' backgroundColor={Platform.OS === "ios" ? null : '#34495e'}/>
                        <TouchableOpacity style={styles.mainBox} activeOpacity={1}>
                            <Text style={styles.displayTicket}>Ticket Code: {this.state.ticketData.ticketCode}</Text>
                            <Text style={styles.displayDetail}>Number : {this.state.ticketData.userNumber}</Text>
                            <Text style={styles.displayDetail}>Total Tickets : {this.state.ticketData.ticketTotal}</Text>
                            <Text style={styles.displayDetail}>Remaining Tickets : {this.state.ticketData.ticketRemaining}</Text>
                            <Text style={styles.displayDetail}>Claimed Tickets : {this.state.ticketData.ticketClaimed}</Text>
                            <Text style={styles.displayDetail}>Amount : {this.state.ticketData.ticketAmount}</Text>
                        </TouchableOpacity>
                        {
                            this.state.validated.length == 0 ? 
                            <TouchableOpacity style={{...styles.redeemBox,alignItems: 'center',justifyContent:'center',height: SCREEN_HEIGHT * 0.2}} activeOpacity={1}>
                                <Text style={{...styles.redeemText, textAlign: 'center'}}>No Ticket Redeemed Yet !</Text>
                            </TouchableOpacity> 
                            :
                            this.state.validated.map((element, key) => {
                                return(
                                    <TouchableOpacity style={{...styles.redeemBox,alignItems: 'center',height: SCREEN_HEIGHT * 0.3,marginBottom: SCREEN_HEIGHT * 0.02}} activeOpacity={1}>
                                        <Text style={{...styles.valText, marginTop: SCREEN_HEIGHT * 0.02, marginBottom: SCREEN_HEIGHT * 0.02}}>Validation : {key+1}</Text>
                                        <Text style={{...styles.valText}}>Validated By: {element.validatedBy}</Text>
                                        <Text style={{...styles.valText}}>Tickets Validated: {element.validatedTickets}</Text>
                                        <Text style={{...styles.valText}}>Timestamp: {element.validatedTimestamp}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                </KeyboardAvoidingView>
            </DismissKeyboard>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(52, 73, 94,0.8)',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  mainBox: {
    backgroundColor: 'rgba(52, 73, 94,1.0)',
    marginTop: SCREEN_HEIGHT * 0.015,
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: SCREEN_WIDTH * 0.09,
    alignSelf: 'center',
  },
  redeemBox: {
    backgroundColor: 'rgba(52, 73, 94,1.0)',
    marginTop: SCREEN_HEIGHT * 0.015,
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.3,
    borderRadius: SCREEN_WIDTH * 0.09,
    alignSelf: 'center',
  },
  displayTicket : {
    color: 'white', 
    fontSize: SCREEN_WIDTH * 0.055, 
    fontWeight:'bold', 
    marginTop: SCREEN_HEIGHT * 0.02, 
    alignSelf: 'center',
    marginBottom: SCREEN_HEIGHT * 0.015,
    textDecorationLine: 'underline',
  },
  displayDetail :{
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.055,
    fontWeight: '700',
    marginTop: SCREEN_HEIGHT * 0.033,
    marginLeft: SCREEN_HEIGHT * 0.02,
  },
  redeemText: {
    fontSize: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.065,
    fontWeight: 'bold',
    color: '#ecf0f1',
    textAlign: 'center',
    justifyContent: 'center',
    marginVertical: SCREEN_HEIGHT * 0.02,
  },
  valText: {
    fontSize: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.04,
    fontWeight: 'bold',
    color: '#ecf0f1',
    textAlign: 'center',
    justifyContent: 'center',
    marginVertical: SCREEN_HEIGHT * 0.012,
  }
});

AppRegistry.registerComponent('ValidationDetails', ()=> ValidationDetails);