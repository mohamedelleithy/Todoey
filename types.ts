import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Home: undefined;
    Register: undefined;
    Tasks: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "Register">;
