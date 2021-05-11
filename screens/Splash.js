import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    StatusBar,
    ActivityIndicator,
    Dimensions,
    AsyncStorage,
    Alert,
} from 'react-native';

var Datastore = require('react-native-storage-mongo-db'), 
genDB = new Datastore({ filename: 'genCollection', autoload: true }),
ticketDB = new Datastore({ filename: 'ticketCollection', autoload: true }),
valDB = new Datastore({ filename: 'valCollection', autoload: true });

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class Splash extends Component{
    
    constructor(){
      super()
      this.state = {
        count: 0,
      }
    }
    
    async componentDidMount(){
      // await AsyncStorage.removeItem('type');
      // await AsyncStorage.removeItem('userDataFlag');
      let type =  await AsyncStorage.getItem("type");
      if(JSON.parse(type)=='generator'){
        let genUsername = await AsyncStorage.getItem("username");
        let genName = await AsyncStorage.getItem("name");
        await AsyncStorage.setItem('currentDay', 'day1');
        setTimeout(()=>{
          this.props.navigation.navigate("GenDashboard", {username: JSON.parse(genUsername), name: JSON.parse(genName), 'genRef':genDB, 'ticketRef': ticketDB});
        },
        500);
      }else if(JSON.parse(type)=='validator'){
        let valUsername = await AsyncStorage.getItem("username");
        let valName = await AsyncStorage.getItem("name");
        await AsyncStorage.setItem('currentDay', 'day1');
        setTimeout(()=>{
          this.props.navigation.navigate("ValDashboard", {username: JSON.parse(valUsername), name: JSON.parse(valName), 'valRef':valDB, 'ticketRef': ticketDB});
        },
        500);
      }else{
        let userDataFlag = await AsyncStorage.getItem('userDataFlag');
        if(JSON.parse(userDataFlag) == '1'){
          setTimeout(()=>{
            this.props.navigation.navigate("Login", {'genRef':genDB, 'valRef':valDB, 'ticketRef': ticketDB});
          },
          500);
        }else{
          genDB.remove({},{multi:true});
          valDB.remove({},{multi:true});
          ticketDB.remove({},{multi:true});
          var generator = [{
            'username': 'GTAB1',
            'name': 'GTAB1',
            'password': '12345',
            'tickets': 0,
          },{
            'username': 'GTAB2',
            'name': 'GTAB2',
            'password': '12345',
            'tickets': 0,
          }];
          var validator = [{
            'username': 'VTAB1',
            'name': 'VTAB1',
            'password': '12345',
            'tickets': 0,
          },{
            'username': 'VTAB2',
            'name': 'VTAB2',
            'password': '12345',
            'tickets': 0,
          }];
          var tickets = [{
            isIssued: false,
            ticketCode: "AFFS5D1-1234567",
            ticketDay: "day1",
            ticketType: "venue",
          },{
            isIssued: false,
            ticketCode: "AFFS5D1-5674567",
            ticketDay: "day1",
            ticketType: "venue",
          },{
            isIssued: false,
            ticketCode: "AFFS5D2-7654321",
            ticketDay: "day2",
            ticketType: "venue",
          },{
            isIssued: false,
            ticketCode: "AFFS5D2-7654765",
            ticketDay: "day2",
            ticketType: "venue",
          },{
            isIssued: false,
            ticketCode: "AFFS5D3-7651234",
            ticketDay: "day3",
            ticketType: "venue",
          },{
            isIssued: false,
            ticketCode: "AFFS5D3-7634734",
            ticketDay: "day3",
            ticketType: "venue",
          },{
            isIssued: false,
            ticketCode: "AFFS5D123-1234567",
            ticketDay: "seasonPass",
            ticketType: "app",
          }];
          genDB.insert(generator, async function () { 
            valDB.insert(validator, async function(){
              ticketDB.insert(tickets, async function(){
                await AsyncStorage.setItem('userDataFlag', '1');
                await AsyncStorage.setItem('currentDay', 'day1');
                await AsyncStorage.setItem('todayPrice', '100');  
                setTimeout(()=>{
                  this.props.navigation.navigate("Login", {'genRef':genDB, 'valRef':valDB, 'ticketRef': ticketDB});
                },
                500);
              }.bind(this));
            }.bind(this));
          }.bind(this));
        }
      }
    }

    render(){
        return(
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <ImageBackground source={require('./../assets/images/background.jpeg')} style={{width: null, height: null, flex: 1}}> 
            <View style={styles.box}>
                <Image
                    style={styles.logo}
                    source={require('./../assets/images/affLogo.png')}
                />
                <Text style={styles.title}>AFF E-Ticket</Text>
                <ActivityIndicator style={styles.loader} size='small' />
            </View>
            </ImageBackground>
        </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  box: {
    marginTop: SCREEN_HEIGHT * 0.28,
    alignItems : 'center',
    flexGrow: 1,
    alignSelf: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.33,
  }, 
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: SCREEN_HEIGHT * 0.03,
  },
});

AppRegistry.registerComponent('Splash', ()=> Splash);