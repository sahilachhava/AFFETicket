import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    StatusBar,
    TouchableOpacity,
    Text,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    AsyncStorage,
    Picker,
    PermissionsAndroid
} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera as Camera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import HandleBack from './../BackHandler';
import * as Animatable from "react-native-animatable";
import Dialog, { DialogTitle, ScaleAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
global.trigger = this;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class ValDashboard extends Component{

    constructor(){
      super()
      this.state = {
        code: '',
        ticket: '',
        manDay: 'day1',
        valName: ' ',
        valUsername: ' ',
        genDB: null,
        ticketDB: null,
        valDB: null,
        isTorchOn: false,
        currentDay: '',
        modalVisible: false,
      }
    }

    static navigationOptions = ({ navigation }) => {
        return{
            title: 'Ticket Validator',
            headerStyle: {
                backgroundColor: '#2c3e50'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: SCREEN_WIDTH * 0.05,
                fontFamily: 'Arial',
            },
            gesturesEnabled: false,
            headerLeft: null,
            headerRight : (
              <View style={{flexDirection : 'row'}}>
              <TouchableOpacity style={{marginRight: SCREEN_WIDTH * 0.05}} onPress={()=>global.trigger.switchFlashState()}>
                <Icon name={'ios-flashlight'} size={SCREEN_HEIGHT * 0.032} color='white'/>
              </TouchableOpacity>
              <View style={{width: SCREEN_WIDTH * 0.030}}></View>
              <TouchableOpacity style={{marginRight: SCREEN_WIDTH * 0.05}} onPress={()=>navigation.navigate("ValProfile", {username: global.trigger.state.valUsername, name: global.trigger.state.valName, genRef: global.trigger.state.genDB, valRef: global.trigger.state.valDB, ticketRef: global.trigger.state.ticketDB})}>
              <Icon name={'ios-contact'} size={SCREEN_HEIGHT * 0.035} color='white'/>
              </TouchableOpacity>
              </View>
            ),
          }
      }

      async componentDidMount(){
        global.trigger = this;
        const day = await AsyncStorage.getItem("currentDay");
        const validator = this.props.navigation.state.params ? this.props.navigation.state.params.username : null;
        if(validator != null){
          this.setState({
            valName: this.props.navigation.state.params.name,
            valUsername: this.props.navigation.state.params.username,
            genDB:this.props.navigation.state.params.genRef, 
            valDB:this.props.navigation.state.params.valRef, 
            ticketDB: this.props.navigation.state.params.ticketRef,
            currentDay: day,
          })
        }
      }

      componentDidUpdate(){
        global.trigger = this;
      }

      onBack = () => {
        if (true) {
          return true;
        }
      };

      switchFlashState(){
        const {isTorchOn} = this.state;
        this.setState({isTorchOn: !isTorchOn});
      }

      clearCode(){
        this.codeInput.clear()
        this.setState({code: ''})
      }

      onQRRead = (e) => {
        const { ticketDB, currentDay, valDB } = this.state;
        const { navigate } = this.props.navigation;
       
        var qrData = JSON.parse(e.data);
        var ticketDay = qrData.ticketDay;
        var ticketCode = qrData.ticketCode;
        var userNumber = qrData.userNumber;
      
        if(ticketDay=="seasonPass"){
          var noOfTicket = qrData.totalSeasonPass;
          ticketDB.findOne({ticketCode: ticketCode, ticketDay: ticketDay}, async function(err, doc){
            if(doc != null){
              if(doc.isIssued == false){
                await ticketDB.update({ticketCode: ticketCode, ticketDay: ticketDay}, {$set: {
                  userNumber: userNumber,
                  isIssued: true,
                  totalTickets: parseInt(noOfTicket),
                  ticketAmount: parseInt(noOfTicket) * 100,
                  isValidated: false,
                  day1: {
                    ticketRemaining: parseInt(noOfTicket),
                    ticketClaimed: 0,
                  },
                  day2: {
                    ticketRemaining: parseInt(noOfTicket),
                    ticketClaimed: 0,
                  },
                  day3: {
                    ticketRemaining: parseInt(noOfTicket),
                    ticketClaimed: 0,
                  },
                  validatedCount: 0,
                  validationDetails: [],
                }});
              }
              navigate('RedeemCode', {redeemTicket: doc, username: this.state.valUsername, currentDay: currentDay, ticketRef: ticketDB, valRef: valDB});
            }else{
              Alert.alert("Error Occured","Ticket Not Found or Try again");
            }
          }.bind(this));
        }else{
          var noOfTicket = qrData.totalTickets;
          ticketDB.findOne({ticketCode: ticketCode, ticketDay: currentDay}, function(err, doc){
            if(doc != null){
              if(doc.isIssued == false){
                ticketDB.update({ticketCode: ticketCode, ticketDay: currentDay}, {$set: {
                  userNumber: userNumber,
                  totalTickets:noOfTicket,
                  ticketAmount: parseInt(noOfTicket) * 100,
                  isValidated: false,
                  isIssued: true,
                  validationDetails: [],
                  ticketRemaining: noOfTicket,
                  ticketClaimed: 0,
                  validatedCount: 0,
                }});
              }
              navigate('RedeemCode', {redeemTicket: doc, username: this.state.valUsername, currentDay: currentDay, ticketRef: ticketDB, valRef: valDB});
            }else{
              Alert.alert("Error Occured","Ticket Not Found or Try again");
            }
          }.bind(this));
        }
      }

      manualRedeem(){
        const {modalVisible} = this.state;
        this.setState({modalVisible: !modalVisible});
      }

      onManualRead(){
        const { navigate } = this.props.navigation;
        const {code, manDay, ticketDB, currentDay, valDB ,ticket} =  this.state;
        var preFix = "AFFS5";

        if(manDay=="day1"){
          preFix += "D1-";
        }else if(manDay=="day2"){
          preFix += "D2-";
        }else if(manDay=="day3"){
          preFix += "D3-";
        }

        preFix += code;

        ticketDB.findOne({ticketCode: preFix, ticketDay: currentDay}, function(err, doc){
          if(doc != null){
            if(doc.isIssued == false){
              ticketDB.update({ticketCode: preFix, ticketDay: currentDay}, {$set: {
                userNumber: "manual scanned",
                totalTickets:ticket,
                ticketAmount: parseInt(ticket) * 100,
                isValidated: false,
                isIssued: true,
                validationDetails: [],
                ticketRemaining: ticket,
                ticketClaimed: 0,
                validatedCount: 0,
              }});
            }
            this.setState({modalVisible:false});
            navigate('RedeemCode', {redeemTicket: doc, username: this.state.valUsername, currentDay: currentDay, ticketRef: ticketDB, valRef: valDB});
          }else{
            Alert.alert("Error Occured","Ticket Not Found or Try again");
          }
        }.bind(this));
      }

      makeSlideOutTranslation(translationType, fromValue) {
        return {
          from: {
            [translationType]: SCREEN_HEIGHT * -0.08
          },
          to: {
            [translationType]: fromValue
          }
        };
      }

    render(){
        return(
        <HandleBack onBack={this.onBack}>
        <DismissKeyboard>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "position" : null}>
        <ScrollView>
            <StatusBar hidden={false} barStyle='light-content' backgroundColor={Platform.OS === "ios" ? null : '#34495e'} />
            <View style={styles.qrContainer}>
            <QRCodeScanner
              onRead={this.onQRRead}
              showMarker={true}
              cameraType='back'
              cameraProps={{ flashMode:this.state.isTorchOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.auto}}
              reactivate={true}
              vibrate={false}
              cameraStyle={{height: SCREEN_HEIGHT * 0.8, width: SCREEN_WIDTH, alignSelf: 'center'}}
              customMarker={
                <View>

                  <View style={styles.topOverlay}>
                    <Text style={{flexDirection: 'row', fontSize: SCREEN_WIDTH * 0.06, color: "white", fontWeight: 'bold'}}>
                      Scan QR Code
                    </Text>
    
                    <Icon
                      name="ios-qr-scanner"
                      size={SCREEN_WIDTH * 0.65}
                      color="skyblue"
                    />
                    <Animatable.View
                      style={styles.scanBar}
                      direction='alternate-reverse'
                      iterationCount='infinite'
                      duration={1100}
                      easing='linear'
                      animation={this.makeSlideOutTranslation(
                        "translateY",
                        SCREEN_HEIGHT * -0.275
                      )}
                    />
                  </View>
                </View>
              }
            />
            </View>
            <View style={styles.enterCodeContainer}>
              <TouchableOpacity style={styles.btn} onPress={()=>this.manualRedeem()}>
                <Text style={styles.btnText}>Manual Redeem</Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
        <Dialog
            visible={this.state.modalVisible}
            dialogTitle={<DialogTitle title="Manual Redeem" />}
            dialogAnimation={new ScaleAnimation({
              initialValue: 1, 
              useNativeDriver: true, 
            })}
            footer={
              <DialogFooter>
               <DialogButton
                  text="Cancel"
                  onPress={()=>this.setState({ modalVisible: false })}
                />
                <DialogButton
                  text="Validate"
                  onPress={()=>this.onManualRead()}
                />
              </DialogFooter>
              }
            onTouchOutside={() => {
              this.setState({ modalVisible: false });
            }}>
            <DialogContent style={{width: SCREEN_WIDTH * 0.9}}>
            <Picker
              selectedValue={this.state.manDay}
              style={{height: 50, width: 200, alignSelf: 'center'}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({manDay: itemValue})
              }>
              <Picker.Item label="3rd Jan (Day 1)" value="day1" />
              <Picker.Item label="4th Jan (Day 2)" value="day2" />
              <Picker.Item label="5th Jan (Day 3)" value="day3" />
            </Picker>
              <TextInput 
                placeholder="Enter Ticket Code"
                onChangeText = {code=>this.setState({code})}
                keyboardType='numeric'
                autoCorrect={false}
                maxLength={10}
                style={{
                  marginTop: SCREEN_HEIGHT * 0.01,
                  color: '#008000',
                  backgroundColor: 'white',
                  fontSize: SCREEN_WIDTH * 0.045,
                  fontWeight: 'bold',
                  borderBottomColor:'#000',
                  textAlignVertical: 'center',
                  borderBottomWidth: 2 
                }}
              />
              <TextInput 
                placeholder="Enter Total Ticket"
                onChangeText = {ticket=>this.setState({ticket})}
                keyboardType='numeric'
                autoCorrect={false}
                maxLength={5}
                style={{
                  marginTop: SCREEN_HEIGHT * 0.01,
                  color: '#008000',
                  backgroundColor: 'white',
                  textAlignVertical: 'center',
                  fontSize: SCREEN_WIDTH * 0.045,
                  fontWeight: 'bold',
                  borderBottomColor:'#000',
                  borderBottomWidth: 2 
                }}
              />
            </DialogContent>
            </Dialog>
        </KeyboardAvoidingView>
        </DismissKeyboard>
        </HandleBack>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(52, 73, 94,0.8)',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  qrContainer: {
    marginTop: SCREEN_HEIGHT * 0.003,
  },
  topOverlay: {
    marginTop: SCREEN_HEIGHT * 0.01,
    height: SCREEN_HEIGHT * 0.4,
    width: SCREEN_WIDTH * 0.8,
    alignItems: 'center',
  },
  scanBar: {
    width: SCREEN_WIDTH * 0.43,
    height: SCREEN_HEIGHT * 0.0025,
    backgroundColor: "skyblue"
  },
  enterCodeContainer: {
    marginTop: SCREEN_HEIGHT * 0.01,
    borderRadius: SCREEN_WIDTH * 0.05,
    height: SCREEN_HEIGHT * 0.10,
    backgroundColor: 'white',
    alignItems:'center',
  },
  btn: {
    marginTop: SCREEN_HEIGHT * 0.005,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.08,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'brown',
    borderRadius: SCREEN_WIDTH * 0.05,
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
});

AppRegistry.registerComponent('ValDashboard', ()=> ValDashboard);