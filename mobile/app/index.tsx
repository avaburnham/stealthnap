import { Link } from 'expo-router';
import { TouchableOpacity, View, Text, Button } from 'react-native';


const squareSize = 140;

const buttonStyle = {
  width: squareSize,
  height: squareSize,
  backgroundColor: '#4A90E2',
  borderRadius: 16,
  alignItems: 'center',
  justifyContent: 'center',
  margin: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.18,
  shadowRadius: 4,
  elevation: 3,
};

const buttonTextStyle = {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  letterSpacing: 1,
};


export const options = {
  title: 'StealthNap',
};

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 34, fontWeight: 'bold', marginBottom: 24 }}>
        StealthNap
      </Text>
       <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 24 }}>
        For the Bold and Brave.
      </Text>
     <Link href="/gear" asChild>
        <TouchableOpacity style={buttonStyle}>
          <Text style={buttonTextStyle}>Gear</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/locations" asChild>
        <TouchableOpacity style={buttonStyle}>
          <Text style={buttonTextStyle}>Locations</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
