import {View, Modal, StyleSheet, ScrollView,  Pressable, Dimensions, DimensionValue,} from "react-native";
import React from "react";
import { DEFAULT_COLORS } from "@/utils";
interface Props{
    children: React.JSX.Element;  
    isVisible: boolean; 
    isDarkMode: boolean
    minHeight?: DimensionValue; 
    onClose?: () => void;
}
export default function ModalWindow({children, isVisible = false, minHeight,isDarkMode, onClose}: Props) {
    return (
        <Modal visible={isVisible} onPointerDownCapture={onClose} animationType="slide"  transparent={true}  onRequestClose={onClose} >
            <Pressable style={[styles.container,{ minHeight: minHeight ?? Dimensions.get("window").height * 0.35 }, ]}   >
                <View style={[ styles.content, {backgroundColor: isDarkMode?DEFAULT_COLORS.secondary:'#fff',  minHeight: minHeight ?? Dimensions.get("window").height * 0.35,  }, ]}  >
                    <ScrollView showsHorizontalScrollIndicator={false}  showsVerticalScrollIndicator={false} >
                        {children}
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: `rgba(0,0,0,0.6)`,
    },
    content: {
        backgroundColor: 'red',
        width: "100%",
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        padding: 10,
        position: "absolute",
        bottom: 0,
    },
});
  