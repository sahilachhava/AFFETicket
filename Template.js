import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    DismissKeyboard,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/Ionicons';
import { firestore } from './../config.js';

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
          code: '',
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
            headerLeft: null,
            headerRight : (
                <View style={{flexDirection : 'row'}}>
                <TouchableOpacity style={{marginRight: SCREEN_WIDTH * 0.05}} onPress={()=>alert("List of Codes")}>
                  <Icon name={'ios-list'} size={SCREEN_HEIGHT * 0.035} color='white'/>
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight: SCREEN_WIDTH * 0.05}} onPress={()=>alert("My Profile")}>
                <Icon name={'ios-contact'} size={SCREEN_HEIGHT * 0.035} color='white'/>
                </TouchableOpacity>
                </View>
            ),
          }
      }

    render(){
        return(
            <DismissKeyboard>
                <View style={styles.container}>
                    <ScrollView>
                        <StatusBar hidden={false} barStyle='light-content' backgroundColor={Platform.OS === "ios" ? null : '#34495e'}/>
                    </ScrollView>
                </View>
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
});

AppRegistry.registerComponent('RedeemCode', ()=> RedeemCode);