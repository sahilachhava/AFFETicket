import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    ActivityIndicator,
} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class GenProfile extends Component{

    constructor(){
        super()
        this.state = {
            genName: ' ',
            genUsername: ' ',
            genTotalTicket: ' ',
            genAmount: ' ',
            loader: false,
            statusLoad: true,
            ticketDB: null,
            genDB: null,
            valDB: null,
        }
      }

    static navigationOptions = ({ navigation }) => {
        return{
            title: 'My Profile',
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

    changePassword=()=>{
        this.props.navigation.navigate("ChangePassword");
    }

    async logOut(){
        const {genDB, valDB,ticketDB} = this.state;
        this.setState({loader: true});
        let genKeys = ['type','username','name', 'password'];
        await AsyncStorage.multiRemove(genKeys);
        this.props.navigation.navigate("Login", {genRef:genDB, valRef:valDB, ticketRef: ticketDB});
        this.setState({loader: false});
    }

    async getTick(){
        this.setState({statusLoad: true});
        var totalTick = 0;
        var totalAmount = 0;
        const day = await AsyncStorage.getItem('currentDay');
        this.state.ticketDB.find({isIssued: true, ticketDay: day}, function(err, querySnapshot){
            querySnapshot.forEach((doc) => {
                const ticket = doc.ticketTotal;
                const amt = doc.ticketAmount;
                totalTick = totalTick + ticket;
                totalAmount = totalAmount + amt;
            })
            this.setState({genTotalTicket: totalTick, genAmount: totalAmount, status : "Details are updated", statusLoad: false})
        }.bind(this));
    }

    componentDidMount(){
        const generator = this.props.navigation.state.params ? this.props.navigation.state.params.name : null;
        if(generator != null){
          this.setState({
                genName: this.props.navigation.state.params.name,
                genUsername: this.props.navigation.state.params.username,
                ticketDB: this.props.navigation.state.params.ticketRef,
                genDB:this.props.navigation.state.params.genRef, 
                valDB:this.props.navigation.state.params.valRef, 
            });
        }
        this.getTick();
    }

    render(){
        if(this.state.loader == true) {
            return(
                <View style={{...styles.container, backgroundColor: 'rgba(52, 73, 94,1.0)'}}>
                    <ActivityIndicator style={styles.loader} size='small' />
                    <Text style={styles.loaderText}>Logging you out...</Text>
                </View>
            )
        }
        return(
            <View style={styles.container}>
                <ScrollView>
                    <StatusBar hidden={false} barStyle='light-content' backgroundColor={Platform.OS === "ios" ? null : '#34495e'}/>
                    <TouchableOpacity style={styles.textBody} activeOpacity={1}>
                        <Text style={{...styles.details,marginTop: SCREEN_HEIGHT * 0.03}}>UserID: {this.state.genUsername}</Text>
                        <Text style={styles.details}>Name: {this.state.genName}</Text>
                        <Text style={styles.details}>Total Tickets: {this.state.genTotalTicket}</Text>
                        <Text style={styles.details}>Total Amount: {this.state.genAmount}</Text>
                        {
                            this.state.statusLoad ? <ActivityIndicator style={{marginTop: SCREEN_HEIGHT * 0.02}} size='small' /> : 
                            <Text style={{...styles.details,fontSize: SCREEN_WIDTH * 0.03, marginTop: SCREEN_HEIGHT * 0.02}}>{this.state.status}</Text>  
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={{...styles.btn, backgroundColor: "#27ae60"}} onPress={()=>this.getTick()}>
                        <Text style={styles.btnText}>Update Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={()=>this.logOut()}>
                        <Text style={styles.btnText}>Logout</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
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
  textBody: {
    marginTop: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    justifyContent: 'center',
    height: SCREEN_HEIGHT * 0.3,
    borderRadius: SCREEN_WIDTH * 0.09,
    backgroundColor: 'rgba(52, 73, 94,1.0)',
  },
  details: {
      alignSelf: 'center',
      marginTop: SCREEN_HEIGHT * 0.01,
      marginBottom: SCREEN_HEIGHT * 0.01,
      fontSize: SCREEN_WIDTH * 0.05,
      fontWeight: 'bold',
      color: 'white',
  },
  btn: {
    backgroundColor: '#e74c3c',
    marginTop: SCREEN_HEIGHT * 0.022,
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
  loader: {
    marginTop: SCREEN_HEIGHT * 0.35,
    alignSelf: 'center',
  },
  loaderText: {
        marginTop: SCREEN_HEIGHT * 0.03,
        alignSelf: 'center',
        color: 'white'
  }, 
});

AppRegistry.registerComponent('GenProfile', ()=> GenProfile);