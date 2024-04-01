package com.pillboxapp;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.MulticastSocket;

public class MulticastListenerModule extends ReactContextBaseJavaModule {
    private static final String TAG = "MulticastModule";
    private Thread multicastThread;
    private ReactApplicationContext currentContext;

    public MulticastListenerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        currentContext = reactContext;
    }

    @Override
    public String getName() {
        return "MulticastListenerModule";
    }

    @ReactMethod
    public void startMulticastReceiver() {
        if (multicastThread != null && multicastThread.isAlive()) {
            Log.i("startMulticastReceiver","Thread is alreay running");
            return;
        }

        multicastThread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    // Perform blocking operations here (e.g., socket.receive)
                    InetAddress group = InetAddress.getByName("228.5.6.7");
                    MulticastSocket socket = new MulticastSocket(6789);
                    socket.joinGroup(group);

                    while (!Thread.currentThread().isInterrupted()) {
                        byte[] buf = new byte[1000];
                        DatagramPacket recv = new DatagramPacket(buf, buf.length);
                        socket.receive(recv);
                        Log.i("RECEIVED_MULTICAST", buf.toString());
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        multicastThread.start();
    }

    @ReactMethod
    public void stopMulticastReceiver() {
        if (multicastThread != null && multicastThread.isAlive()) {
            multicastThread.interrupt();
        }
    }

    private void sendEvent(String eventName){
        currentContext.getJSModule(ReactContext.RCTDeviceEventEmitter.class).emit(eventName, null);
    }
    private void sendEvent(String eventName, WritableMap params){
        currentContext.getJSModule(ReactContext.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
    private void sendEvent(String eventName, WritableArray params){
        currentContext.getJSModule(ReactContext.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}

