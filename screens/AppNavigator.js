import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PostDetailScreen from "./PostDetailScreen";
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ReportFormScreen from "../screens/ReportFormScreen";
import ContactFormScreen from "../screens/ContactFormScreen";
import AdminPanel from "../screens/AdminPanel";
import CommentsScreen from '../screens/CommentsScreen';
import RatingScreen from "../screens/RatingScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import DeletePostScreen from "../screens/DeletePostScreen";
import MessagesScreen from "../screens/MessageScreen";
import ReportsScreen from "../screens/ReportsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const AppNavigator = () => {
    const { isLoggedIn } = useContext(AuthContext);

    if (!isLoggedIn) {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerStyle: {
                        backgroundColor: '#212121',
                    },
                    headerTintColor: 'white',
                    tabBarStyle: {
                        backgroundColor: '#212121'
                    },
                    tabBarIcon: ({ focused,  size }) => {
                        let iconName = getIconName(route.name, focused);
                        return <Ionicons name={iconName} size={size} color={'white'} />;
                    },
                    tabBarLabelStyle: { color: 'white' },
                })}
            >
                <Tab.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }}/>
                <Tab.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }}/>
            </Tab.Navigator>

        );
    }

    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#424242',
            },
            headerTintColor: 'white', // Ustawienie koloru tekstu dla nagłówka
        }}>
            <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="ContactFormScreen" component={ContactFormScreen} options={{ title: 'Contact Form' }} />
            <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} options={{ title: 'Post Details' }} />
            <Stack.Screen name="ReportFormScreen" component={ReportFormScreen} options={{ title: 'Report Form' }} />
            <Stack.Screen name="Comments" component={CommentsScreen} options={{ title: 'Comments' }} />
            <Stack.Screen name="Rating" component={RatingScreen} options={{ title: 'Rating' }} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Create Post' }} />
            <Stack.Screen name="DeletePost" component={DeletePostScreen} options={{ title: 'Delete Post' }} />
            <Stack.Screen name="Messages" component={MessagesScreen} options={{title: 'Messages'}}/>
            <Stack.Screen name="Reports" component={ReportsScreen} options={{title: 'Reports'}}/>

        </Stack.Navigator>
    );
};

const TabNavigator = () => {
    const { isAdmin } = useContext(AuthContext);
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size } ) => {
                let iconName = getIconName(route.name, focused);
                return <Ionicons name={iconName} size={size} color={'white'} />;
            },
            tabBarLabelStyle: { color: 'white' },
            headerStyle: {
                backgroundColor: '#212121',
            },
            headerTintColor: 'white',
            tabBarStyle: {
                backgroundColor: '#212121',
            },
        })}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
            {isAdmin && (
                <Tab.Screen
                    name="AdminPanel"
                    component={AdminPanel}
                    options={{ tabBarLabel: 'Admin Panel' }}
                />
            )}
        </Tab.Navigator>
    );
};




function getIconName(routeName, focused) {
    const icons = {
        Home: focused ? 'home' : 'home-outline',
        Favorites: focused ? 'heart' : 'heart-outline',
        Profile: focused ? 'person' : 'person-outline',
        Search: focused ? 'search' : 'search-outline',
        Settings: focused ? 'settings' : 'settings-outline',
        AdminPanel: focused ? 'settings' : 'settings-outline',
        Login: focused ? 'log-in' : 'log-in-outline',
        Register: focused ? 'person-add' : 'person-add-outline',
        Messages: focused ? 'mail' : 'mail-outline',
    };
    return icons[routeName] || 'alert-circle-outline';
}

export default AppNavigator;
