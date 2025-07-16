import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { Button, Input, Text } from "~/component/atom";
import { authClient } from "~/utils/auth";
import { Example } from "./example";
import { Example2 } from "./example2";

function MobileAuth() {
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    await authClient.signIn.email({
      email,
      password,
    });
  }

  if (session) {
    return (
      <>
        <Text className="pb-2 text-center text-xl font-semibold text-zinc-900">
          {`Hello, ${session.user.name}`}
        </Text>
        <Button onPress={() => authClient.signOut()}>
          <Text>Sign Out</Text>
        </Button>
      </>
    );
  }

  return (
    <View>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button onPress={handleLogin}>
        <Text>Sign In</Text>
      </Button>
    </View>
  );
}

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>

        <MobileAuth />

        <Example />
        <Example2 />
      </View>
    </SafeAreaView>
  );
}
