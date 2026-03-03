from .prompt_builder import PromptBuilder

class MentorService:
    def __init__(self):
        self.prompt_builder = PromptBuilder()

    def get_mentor_response(self, mode, user_input, context):
        """
        Processes user input and context to generate a mentor response.
        For now, this returns a mock response.
        In the future, it will call Amazon Bedrock.
        """
        # Construct the prompt
        prompt = self.prompt_builder.build_prompt(mode, user_input, context)
        print(f"DEBUG: Constructing prompt for Bedrock: {prompt}")

        # Mocking Bedrock response - structured by mode
        if mode == "learn":
            # For Learn mode, return structured response using the new context-aware format
            level = context.get('level', context.get('user_level', 'beginner'))
            track = context.get('track', 'backend')
            topic = context.get('topic', 'general programming')

            reply = f"""### 📘 Concept Explanation
Based on your {level} skill level in {track} development, here's a clear explanation of the concept you're learning. This explanation adapts to your current topic: {topic}.

### 💻 Practical Example
Here's a practical code example or real-world use case relevant to {track} development. This demonstrates how the concept applies in your learning track.

### 🧠 Why This Matters
This concept is important for your {track} learning path because it helps you build foundational skills that will support more advanced topics. Understanding this now will make future concepts easier to grasp.

### 🧪 Practice Task
As a {level} learner, try this practice task:
- Work through a simple example related to {topic}
- Apply what you've learned in a small project or code snippet

### 🚀 Suggested Next Topic
Based on your current topic ({topic}), consider learning about the next logical concept in your {track} learning path to continue building your skills."""
        else:
            # Keep existing mock responses for other modes
            mock_replies = {
                "code": "I've analyzed your code. The error seems to be related to... Here's how to fix it...",
                "roadmap": "Based on your goals, here's a step-by-step learning plan designed specifically for you...",
                "productivity": "Here's a time-based study plan to help you stay focused and productive today..."
            }
            reply = mock_replies.get(mode, "I'm here to help with your learning journey. What would you like to know?")

        return {
            "reply": reply
        }

# Initializing a singleton instance
mentor_service = MentorService()
