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
    Alert,
    AsyncStorage,
    View,
} from 'react-native';
import { ScrollView, TextInput } from "react-native-gesture-handler";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class RedeemCode extends Component{

    constructor(){
        super()
        this.state = {
          ticketData: {},
          redeemTicketNo: '',
          valUsername: '',
          btnState: false,
          ticketDB: null,
          valDB: null,
          day: '',
          pDay: {
            ticketRemaining: 0,
            ticketClaimed: 0
          },
        }
      }

    static navigationOptions = ({ navigation }) => {
        return{
            title: 'Redeem Code',
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

    async componentDidMount(){
      global.trigger = this;
      const redeemTicket = this.props.navigation.state.params ? this.props.navigation.state.params.redeemTicket : null;
      const day = this.props.navigation.state.params.currentDay;
      const data = this.props.navigation.state.params.redeemTicket;
      const pDay = data[day];
      if(redeemTicket != null){
          await this.setState({
            ticketData: this.props.navigation.state.params.redeemTicket,
            valUsername: this.props.navigation.state.params.username,
            ticketDB: this.props.navigation.state.params.ticketRef,
            valDB:this.props.navigation.state.params.valRef, 
            day:this.props.navigation.state.params.currentDay, 
            pDay: pDay,
          }); 
      }
    }

    componentDidUpdate(){
      global.trigger = this;
    }

    getTimestamp=()=>{
        var timeStamp = "";
        var date = new Date().getDate(); // Date
        var month = new Date().getMonth() + 1; // Month
        var year = new Date().getFullYear(); // Year
        var hours = new Date().getHours(); // Hours
        var min = new Date().getMinutes(); // Minutes
        var sec = new Date().getSeconds(); // Seconds
        timeStamp = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec;
        return timeStamp;
      }

    clearCode(){
        this.ticketInput.clear()
        this.setState({redeemTicketNo: 0})
    }

    redeemTicket=()=>{
        if(this.state.redeemTicketNo == ''){
          Alert.alert("Warning !","Please enter no of tickets");
        }else{
          this.setState({btnState: true})
          const {ticketDB,valDB,redeemTicketNo,ticketData,valUsername,day,pDay} = this.state;
          const { navigate } = this.props.navigation;
          const ticketNo = parseInt(redeemTicketNo);
          ticketDB.findOne({ticketDay: ticketData.ticketDay, ticketCode: ticketData.ticketCode}, function(err, doc) { 
            if(doc != null){
              if(ticketData.ticketDay=="seasonPass"){
                var docRef = pDay;
                if(docRef.ticketRemaining < ticketNo){
                  Alert.alert("Warning !","Please enter valid No of tickets");
                  this.setState({btnState: false, redeemTicketNo: ''})
                }else if(docRef.ticketRemaining >= ticketNo){
                  const newValidation = {
                    validatedBy: valUsername,
                    validatedTimestamp: this.getTimestamp(),
                    validatedTickets: ticketNo,
                  };
                  if(doc.validationDetails == null){
                    doc.validationDetails = newValidation;
                  }else{
                    doc.validationDetails.push(newValidation);
                  }
                  Alert.alert(ticketData.ticketCode, ticketNo + " Ticket Redeemed Successfully");
                  ticketDB.update({ticketDay: ticketData.ticketDay, ticketCode: ticketData.ticketCode}, {$set: {
                    isValidated: true,
                    [day] : {
                      ticketClaimed: docRef.ticketClaimed + ticketNo,
                      ticketRemaining: docRef.ticketRemaining - ticketNo,
                    },
                    validatedCount: doc.validatedCount + 1,
                    validationDetails: doc.validationDetails, 
                  }});
                  navigate('ValDashboard', {username: valUsername, name: valUsername, 'valRef':valDB, 'ticketRef': ticketDB});
                }
              }else{
                if(doc.ticketRemaining < ticketNo){
                  Alert.alert("Warning !","Please enter valid No of tickets");
                  this.setState({btnState: false, redeemTicketNo: ''})
                }else if(doc.ticketRemaining >= ticketNo){
                  const newValidation = {
                    validatedBy: valUsername,
                    validatedTimestamp: this.getTimestamp(),
                    validatedTickets: ticketNo,
                  };
                  if(doc.validationDetails == null){
                    doc.validationDetails = newValidation;
                  }else{
                    doc.validationDetails.push(newValidation);
                  }
                  Alert.alert(ticketData.ticketCode, ticketNo + " Ticket Redeemed Successfully");
                  ticketDB.update({ticketDay: ticketData.ticketDay, ticketCode: ticketData.ticketCode}, {$set: {
                    isValidated: true,
                    ticketClaimed: parseInt(doc.ticketClaimed + ticketNo),
                    ticketRemaining: parseInt(doc.ticketRemaining - ticketNo),
                    validatedCount: parseInt(doc.validatedCount + 1),
                    validationDetails: doc.validationDetails, 
                  }});
                  navigate('ValDashboard', {username: valUsername, name: valUsername, 'valRef':valDB, 'ticketRef': ticketDB});
                }
              }
            }
          }.bind(this));
        }
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
                            <Text style={styles.displayDetail}>Total Tickets : {this.state.ticketData.totalTickets}</Text>
                            {
                              this.state.ticketData.ticketDay == "seasonPass" ?
                                <View>
                                  <Text style={styles.displayDetail}>Remaining Tickets : {this.state.pDay.ticketRemaining}</Text>
                                  <Text style={styles.displayDetail}>Claimed Tickets : {this.state.pDay.ticketClaimed}</Text>      
                                </View>
                                : 
                                <View>
                                  <Text style={styles.displayDetail}>Remaining Tickets : {this.state.ticketData.ticketRemaining}</Text>
                                  <Text style={styles.displayDetail}>Claimed Tickets : {this.state.ticketData.ticketClaimed}</Text> 
                                </View>
                            }
                            <Text style={styles.displayDetail}>Amount : {this.state.ticketData.ticketAmount}</Text>
                        </TouchableOpacity>
                        {
                          this.state.ticketData.ticketDay == "seasonPass" ?
                              this.state.pDay.ticketRemaining == 0 ? 
                              <TouchableOpacity style={{...styles.redeemBox,alignItems: 'center',justifyContent:'center',height: SCREEN_HEIGHT * 0.2}} activeOpacity={1}>
                                  <Text style={{...styles.redeemText, textAlign: 'center'}}>This Code is Out of Tickets</Text>
                              </TouchableOpacity> 
                              :
                              <TouchableOpacity style={styles.redeemBox} activeOpacity={1}>
                                  <TextInput
                                      style={styles.ticketNo}
                                      placeholder="Enter No of Tickets"
                                      placeholderTextColor='white'
                                      keyboardType='numeric'
                                      onFocus={()=>this.clearCode()}
                                      ref={(input) => this.ticketInput = input}
                                      onChangeText={redeemTicketNo=>this.setState({redeemTicketNo})}
                                  />
                                  <TouchableOpacity style={{...styles.btn, backgroundColor: this.state.btnState == false ? '#e74c3c' : 'gray'}} disabled={this.state.btnState} onPress={()=>this.redeemTicket()}>
                                      <Text style={styles.btnText}>Redeem E-Tickets</Text>
                                  </TouchableOpacity>
                              </TouchableOpacity>
                              :
                              this.state.ticketData.ticketRemaining == 0 ? 
                              <TouchableOpacity style={{...styles.redeemBox,alignItems: 'center',justifyContent:'center',height: SCREEN_HEIGHT * 0.2}} activeOpacity={1}>
                                  <Text style={{...styles.redeemText, textAlign: 'center'}}>This Code is Out of Tickets</Text>
                              </TouchableOpacity> 
                              :
                              <TouchableOpacity style={styles.redeemBox} activeOpacity={1}>
                                  <TextInput
                                      style={styles.ticketNo}
                                      placeholder="Enter No of Tickets"
                                      placeholderTextColor='white'
                                      keyboardType='numeric'
                                      onFocus={()=>this.clearCode()}
                                      ref={(input) => this.ticketInput = input}
                                      onChangeText={redeemTicketNo=>this.setState({redeemTicketNo})}
                                  />
                                  <TouchableOpacity style={{...styles.btn, backgroundColor: this.state.btnState == false ? '#e74c3c' : 'gray'}} disabled={this.state.btnState} onPress={()=>this.redeemTicket()}>
                                      <Text style={styles.btnText}>Redeem E-Tickets</Text>
                                  </TouchableOpacity>
                              </TouchableOpacity>
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
  ticketNo: {
    marginTop: SCREEN_HEIGHT * 0.05,
    fontSize: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.8,
    borderBottomColor: 'white',
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: SCREEN_HEIGHT * 0.015,
    borderBottomWidth: 3,
    alignSelf: 'center',
    //textAlign: 'center',
  },
  btn: {
    marginTop: SCREEN_HEIGHT * 0.04,
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.07,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: SCREEN_WIDTH * 0.09,
  },
  btnText: {
    fontSize: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.065,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: SCREEN_HEIGHT * 0.015,
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
  }
});

AppRegistry.registerComponent('RedeemCode', ()=> RedeemCode);