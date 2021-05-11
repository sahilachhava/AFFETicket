import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    StatusBar,
    Dimensions,
    Image,
    Text,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

export default class NoInternet extends Component{

    constructor(){
        super()
        this.state = {
            status: false,
            netStatus: null,
        }
    }  

    tryAgain = () => {
        NetInfo.isConnected.addEventListener(
            "connectionChange",
            hasInternetConnection => {
            this.setState({status : true});
            if(hasInternetConnection){
                setTimeout(()=>{
                    this.setState({status : false});
                    this.props.navigation.navigate("Login");
                },
                1000);
            }else{
                setTimeout(()=>{
                    this.setState({status : false});
                    this.props.navigation.navigate("NoInternet");
                },
                1000);
            }
        });
    }

    render(){
        return(
            <DismissKeyboard>
            <View style={styles.container}>
                <ScrollView>
                    <StatusBar hidden={false} barStyle='light-content' backgroundColor={Platform.OS === "ios" ? null : '#34495e'}/>
                    <View style={styles.mainBox}>
                        <Image
                            style={styles.wifiOff}
                            source={require('./../assets/images/wifiof.png')}
                        />
                        <Text style={styles.text}> No Internet Detected </Text>
                        <Text style={styles.text2}> Turn On Internet and Try again </Text>
                        <TouchableOpacity style={styles.btn} activeOpacity={0.3} onPress={()=>this.tryAgain()}>
                            <Text style={styles.text3}>Try again</Text>
                        </TouchableOpacity>
                        {
                            this.state.status == true ? <ActivityIndicator style={styles.loader} size='small' /> : null
                        }
                    </View>
                </ScrollView>
            </View>
            </DismissKeyboard>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5079AC',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },  
  mainBox : {
    marginTop: SCREEN_HEIGHT * 0.27,
    alignSelf: 'center',
    alignItems: 'center',
  },
  wifiOff: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.2,
  },      
  text : {
    marginTop: SCREEN_HEIGHT * 0.05,
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  text2 : {
    marginTop: SCREEN_HEIGHT * 0.02,
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  btn : {
    marginTop: SCREEN_HEIGHT * 0.03,
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.06,
    borderRadius: SCREEN_WIDTH * 0.04,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
  },
  text3 : {
    marginTop: SCREEN_HEIGHT * 0.015,
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  loader: {
    marginTop: SCREEN_HEIGHT * 0.03,
  },
});

AppRegistry.registerComponent('NoInternet', ()=> NoInternet);