import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Alert,
    AsyncStorage,
} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/Ionicons';
import HandleBack from './../BackHandler';
import RNPrint from 'react-native-print';
import QRCode from 'react-native-qrcode-image';
import Dialog, { DialogTitle, ScaleAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
global.trigger = this;
global.Buffer = global.Buffer || require('buffer').Buffer

export default class GenDashboard extends Component{

    constructor(){
        super()
        this.state = {
          name: ' ',
          pass: 0,
          genBtnState: false,
          resetBtnState: true,
          generated: false,
          today: ' ',
          ticketCode: ' ',
          focusToAnother: false,
          genName: ' ',
          genUsername: ' ',
          modalVisible: false,
          modalPrice: 0,
          genDB: null,
          ticketDB: null,
          valDB: null,
        }
      }   

    static navigationOptions = ({ navigation }) => {
        return{
            title: 'Ticket Generator',
            headerStyle: {
                backgroundColor: '#2c3e50',
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
              <TouchableOpacity style={{marginRight: SCREEN_WIDTH * 0.05}} onPress={()=>navigation.navigate("AllTickets", {username: global.trigger.state.genUsername, name: global.trigger.state.genName, ticketRef: global.trigger.state.ticketDB})}>
                <Icon name={'ios-list'} size={SCREEN_HEIGHT * 0.035} color='white'/>
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight: SCREEN_WIDTH * 0.05}} onPress={()=>navigation.navigate("GenProfile", {username: global.trigger.state.genUsername, name: global.trigger.state.genName, genRef: global.trigger.state.genDB, valRef: global.trigger.state.valDB, ticketRef: global.trigger.state.ticketDB})}>
              <Icon name={'ios-contact'} size={SCREEN_HEIGHT * 0.035} color='white'/>
              </TouchableOpacity>
              </View>
            ),
          }
      }

    async componentDidMount(){
      this.phoneInput.focus();
      global.trigger = this;
      const generator = this.props.navigation.state.params ? this.props.navigation.state.params.name : null;
      if(generator != null){
        this.setState({
          genName: this.props.navigation.state.params.name,
          genUsername: this.props.navigation.state.params.username,
          genDB:this.props.navigation.state.params.genRef, 
          valDB:this.props.navigation.state.params.valRef, 
          ticketDB: this.props.navigation.state.params.ticketRef
        });
      }
     this.props.navigation.state.params.ticketRef.update({isIssued: true}, {$set: {isIssued:false}});
    }

    componentDidUpdate(){
      global.trigger = this;
      if(this.state.name.length==10 && this.state.focusToAnother==false){
        this.phoneInput.blur();
        this.passwordInput.focus();
        this.setState({focusToAnother: true});
      }
    }

    onBack = () => {
      if (true) {
        return true;
      }
    }

    getTimestamp=()=>{
      var timeStamp = "";
      var date = new Date().getDate(); //Date
      var month = new Date().getMonth() + 1; //Month
      var year = new Date().getFullYear(); //Year
      var hours = new Date().getHours(); //Hours
      var min = new Date().getMinutes(); //Minutes
      var sec = new Date().getSeconds(); //Seconds
      timeStamp = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec;
      return timeStamp;
    }

    resetFun=()=>{
      if(this.state.genBtnState == true){
        this.setState({genBtnState: false, resetBtnState: true});
      }else{
          this.setState({genBtnState: true, resetBtnState: false});
      }
      this.setState({generated: false, focusToAnother: false, name: "", pass: ""});
      this.phoneInput.clear();
      this.passwordInput.clear();
      this.phoneInput.focus();
    }

    validateFields=()=>{
      if(this.state.name=="" || this.state.name.length!=10){
        Alert.alert("Warning !","Enter Valid Phone Number");
        this.phoneInput.focus();
        return false;
      }else if(this.state.pass==""){
        Alert.alert("Warning !","Enter No of Tickets");
        this.passwordInput.focus();
        return false;
      }else{
        return true;
      }
    }
    
    async printHTML(ticketCode,tickets,user,modalPrice,genUsername,timeStamp,paidBy,today){
      var qrData = '{"ticketDay": '+today+', "totalTickets": '+tickets+', "ticketCode":'+ticketCode+', "userNumber":'+user+'}';
      await RNPrint.print({
        html: '<center><br>'+
              //'<img src="./../../assets/images/affLogo.png" height="100" width="100" /><br>'+
              '<h3>Ahmedabad Food Fest 2020</h3>'+
              '<h4>Season 5</h4>'+
              '<h5>E-Ticket: '+ticketCode+'</h5>'+
              '<h5>No of Ticket: '+tickets+'</h5>'+
              //'<h5>Phone No: '+user+'</h5>'+
              //'<h5>Generated By: '+genUsername+'</h5>'+
              //'<h5>TimeStamp: '+timeStamp+'</h5>'+
              '<h5>Total Amount: '+modalPrice+'</h5>'+
              //'<h5>Paid By: '+paidBy+'</h5>'+
              '<img src="https://api.qrserver.com/v1/create-qr-code/?data='+qrData+'&amp;size=100x100" width="150" height="150" />'+
              '</center>'
      })
    }

    async popTicket(){
      var validated = this.validateFields();
      if(validated!=true){
        return;
      }

      var day = await AsyncStorage.getItem('currentDay');
      var todayPrice = await AsyncStorage.getItem('todayPrice');
      const {ticketDB,pass} = this.state;
      
      ticketDB.findOne({ticketDay: day, isIssued: false},function(err, doc){
        if(doc != null){
          var ticketCode = doc.ticketCode;
          this.setState({modalVisible: true, ticketCode: ticketCode, modalPrice: parseInt(todayPrice)*pass, today: day});
        }else{
          alert("No Ticket Found");
        }
      }.bind(this));
    }

    generateTicket(paidBy){
        if(this.state.genBtnState == true){
          this.setState({genBtnState: false, resetBtnState: true});
        }else{
          this.setState({genBtnState: true, resetBtnState: false});
        }
        const timeStamp = this.getTimestamp();
        const {name, pass, genUsername, ticketCode, modalPrice,today, genDB, ticketDB} = this.state;
      
        ticketDB.update({'ticketCode': ticketCode},{$set: {
          userNumber: name,
          paidBy: paidBy,
          ticketTotal: parseInt(pass),
          ticketAmount: parseInt(modalPrice),
          generatedBy: genUsername,
          ticketTimestamp: timeStamp,
          isIssued: true,
        }});
        this.printHTML(ticketCode,pass,name,modalPrice,genUsername,timeStamp,paidBy,today);
        genDB.update({'username':genUsername}, {$set: {$inc : {tickets: parseInt(pass)}}});
        this.setState({generated: true, modalVisible: false});
    }

    render(){
        return(
          <HandleBack onBack={this.onBack}>
            <View style={styles.container}>
            <ScrollView>
            <StatusBar hidden={false} barStyle='light-content' backgroundColor={Platform.OS === "ios" ? null : '#34495e'}/>
            <TouchableOpacity style={styles.mainBox} activeOpacity={1}>
            <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.username}
                    placeholder="Phone Number"
                    placeholderTextColor='rgba(0,128,0,0.6)'
                    keyboardType='numeric'
                    autoCorrect={false}
                    maxLength={10}
                    ref={(input) => this.phoneInput = input}
                    onChangeText = {name=>this.setState({name})}
                  />
                  <Icon name={'ios-contact'} size={SCREEN_HEIGHT * 0.035} color='red' style={styles.usernameIcon} />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.username}
                    placeholder="No of Tickets"
                    placeholderTextColor='rgba(0,128,0,0.6)'
                    keyboardType='numeric'
                    autoCorrect={false}
                    maxLength={3}
                    ref={(input) => this.passwordInput = input}
                    onChangeText = {pass=>this.setState({pass})}
                  />
                  <Icon name={'ios-today'} size={SCREEN_HEIGHT * 0.035} color='red' style={styles.usernameIcon} />
                </View>
                <View>
                  <TouchableOpacity 
                        style={{backgroundColor: this.state.genBtnState == false ? "#ED4C67" : "#2f3542",
                            marginTop: SCREEN_HEIGHT * 0.03,
                            width: SCREEN_WIDTH * 0.87,
                            height: SCREEN_HEIGHT * 0.065,
                            borderRadius: SCREEN_WIDTH * 0.09,
                            alignSelf: 'center',
                        }} 
                        disabled={this.state.genBtnState}
                        onPress={()=>this.popTicket()}>
                    <Text style={styles.btnText}>Generate</Text>
                  </TouchableOpacity> 
                </View>
                <View>
                  <TouchableOpacity 
                    style={{backgroundColor: this.state.resetBtnState == false ? "#27ae60" : "#2f3542",
                        marginTop: SCREEN_HEIGHT * 0.03,
                        width: SCREEN_WIDTH * 0.87,
                        height: SCREEN_HEIGHT * 0.065,
                        borderRadius: SCREEN_WIDTH * 0.09,
                        alignSelf: 'center',
                    }}
                    disabled={this.state.resetBtnState}
                    onPress={this.resetFun} >
                    <Text style={styles.btnText}>Reset</Text>
                  </TouchableOpacity> 
                </View>
            </TouchableOpacity>
            {this.state.generated==true ? <TicketDisplay code={this.state.ticketCode!="" ? this.state.ticketCode : " "} day={this.state.today!="" ? this.state.today : " "} ticketRef={this.state.ticketDB} /> : null}
            </ScrollView>
            <Dialog
            visible={this.state.modalVisible}
            dialogTitle={<DialogTitle title="Paid by" />}
            dialogAnimation={new ScaleAnimation({
              initialValue: 1, 
              useNativeDriver: true, 
            })}
            footer={
              <DialogFooter>
                <DialogButton
                  text="CASH"
                  onPress={()=>this.generateTicket("Cash")}
                />
                <DialogButton
                  text="PAYTM/CARD"
                  onPress={()=>this.generateTicket("Paytm/Card")}
                />
              </DialogFooter>
            }
          onTouchOutside={() => {
            this.setState({ modalVisible: false });
          }}>
          <DialogContent style={{width: SCREEN_WIDTH * 0.9}}>
            <Text style={{color: "red", 
            width: SCREEN_WIDTH * 0.9, 
            marginVertical: SCREEN_HEIGHT * 0.03, 
            fontSize: SCREEN_WIDTH * 0.05, 
            fontWeight: 'bold'}}>
              Ticket No: {this.state.ticketCode}
            </Text>
            <Text style={{color: "red", 
            width: SCREEN_WIDTH * 0.9, 
            marginVertical: SCREEN_HEIGHT * 0.03, 
            fontSize: SCREEN_WIDTH * 0.05, 
            fontWeight: 'bold'}}>
              Total Amount: Rs. {this.state.modalPrice}/-
            </Text>
          </DialogContent>
          </Dialog>
        </View>
        </HandleBack>
        )
    }
}

class TicketDisplay extends React.Component {
  constructor(){
    super()
    this.state = {
      ticket: ' ',
      phone: '',
      total: '',
      generated: '',
      amount: '',
      modalVisible: false,
      paidBy: '',
    }
  }

  componentDidMount(){
    var ticketDB = this.props.ticketRef;
    ticketDB.findOne({ticketDay: this.props.day, ticketCode: this.props.code}, function(err, doc){
      var ticketDoc = doc;
      this.setState({
        ticket: ticketDoc.ticketCode,
        phone: ticketDoc.userNumber,
        total: ticketDoc.ticketAmount,
        generated: ticketDoc.generatedBy,
        amount: ticketDoc.ticketAmount,
        paidBy: ticketDoc.paidBy,
      });
    }.bind(this));
  }

  render(){
    return(
      <View>
      <TouchableOpacity
        style={{
          backgroundColor: 'rgba(52, 73, 94,1.0)',
          marginTop: SCREEN_HEIGHT * 0.03,
          width: SCREEN_WIDTH * 0.9,
          height: SCREEN_HEIGHT * 0.35,
          borderRadius: SCREEN_WIDTH * 0.09,
          alignSelf: 'center',
        }}
        activeOpacity={1}>
        <Text style={styles.displayTicket}>Ticket Code: {this.state.ticket}</Text>
        <Text style={styles.displayDetail}>Number: {this.state.phone}</Text>
        <Text style={styles.displayDetail}>No of Tickets: {this.state.total}</Text>
        <Text style={styles.displayDetail}>Amount: {this.state.amount}</Text>
        <Text style={styles.displayDetail}>Generated By: {this.state.generated}</Text>
        <Text style={styles.displayDetail}>Paid By: {this.state.paidBy}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(52, 73, 94,0.8)',
    position: 'relative',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  mainBox: {
    marginTop: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.45,
    borderRadius: SCREEN_WIDTH * 0.09,
    backgroundColor: 'rgba(52, 73, 94,1.0)',
    alignSelf: 'center',
  },
  inputContainer: {
    marginTop: SCREEN_HEIGHT * 0.015
  },
  username: {
    marginTop: SCREEN_HEIGHT * 0.022,
    marginHorizontal: SCREEN_WIDTH * 0.045,
    paddingLeft: SCREEN_WIDTH * 0.14,
    paddingRight: SCREEN_WIDTH * 0.2,
    color: '#008000',
    backgroundColor: 'white',
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.07,
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    borderRadius: SCREEN_WIDTH * 0.09,
  },
  usernameIcon: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.038,
    left: SCREEN_WIDTH * 0.09
  },
  generateBtn: {
    marginTop: SCREEN_HEIGHT * 0.03,
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.065,
    borderRadius: SCREEN_WIDTH * 0.09,
    backgroundColor: '#ED4C67',
    alignSelf: 'center',
  },
  btnText: {
    fontSize: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.065,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: SCREEN_HEIGHT * 0.01,
  },
  displayTicket : {
    color: 'white', 
    fontSize: SCREEN_WIDTH * 0.052, 
    fontWeight:'bold', 
    marginTop: SCREEN_HEIGHT * 0.015, 
    alignSelf: 'center',
    marginBottom: SCREEN_HEIGHT * 0.015,
    textDecorationLine: 'underline',
  },
  displayDetail :{
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '700',
    marginTop: SCREEN_HEIGHT * 0.01,
    marginLeft: SCREEN_HEIGHT * 0.025,
  },
});

AppRegistry.registerComponent('GenDashboard', ()=> GenDashboard);