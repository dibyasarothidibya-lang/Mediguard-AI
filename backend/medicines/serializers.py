from rest_framework import serializers


class ChatHistoryMessageSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=["user", "assistant"])
    content = serializers.CharField(max_length=4000, allow_blank=False)


class ChatRequestSerializer(serializers.Serializer):
    question = serializers.CharField(
        required=True,
        allow_blank=False,
        max_length=4000,
        trim_whitespace=True,
    )
    history = ChatHistoryMessageSerializer(many=True, required=False, default=list)

    def validate_history(self, value):
        if len(value) > 6 or sum(len(item["content"]) for item in value) > 16000:
            raise serializers.ValidationError("Conversation context is too long.")
        if len(value) % 2 or any(
            item["role"] != ("user" if index % 2 == 0 else "assistant")
            for index, item in enumerate(value)
        ):
            raise serializers.ValidationError("History must contain complete user/assistant exchanges.")
        return value
