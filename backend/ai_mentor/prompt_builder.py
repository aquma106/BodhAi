class PromptBuilder:
    @staticmethod
    def build_learn_prompt(user_input, context):
        """
        Build a dynamic, context-aware prompt for Learn mode.

        Args:
            user_input: The user's question or learning request
            context: Dictionary containing user profile information

        Returns:
            A structured prompt that adapts to the user's skill level, track, and topic
        """
        # Extract context with safe defaults
        name = context.get('name', 'Learner')
        level = context.get('level', context.get('user_level', 'beginner'))
        track = context.get('track', 'backend')
        topic = context.get('topic', 'general programming')
        progress = context.get('progress', 0)

        # Ensure progress is a valid number
        try:
            progress = int(progress) if progress else 0
        except (ValueError, TypeError):
            progress = 0

        # Build the dynamic prompt
        prompt = f"""You are BodhAI — an adaptive AI learning mentor.

User Profile:
- Name: {name}
- Skill Level: {level}
- Learning Track: {track}
- Current Topic: {topic}
- Progress: {progress}%

Teaching Guidelines:

1. Adapt explanation depth to skill level:
   * Beginner: Use simple language, analogies, and foundational concepts
   * Intermediate: Include practical examples, edge cases, and best practices
   * Advanced: Discuss optimization, design patterns, and deeper insights

2. Connect the explanation to their learning track ({track}):
   * frontend: Focus on UI, UX, performance, and browser concepts
   * backend: Focus on servers, databases, APIs, and scalability
   * ai: Focus on algorithms, models, data processing, and ML concepts
   * fullstack: Balance between frontend and backend integration

3. Assume the user is currently studying "{topic}"

4. Avoid generic textbook explanations. Make content relevant to their track and level.

User Question:
{user_input}

Response Format:

Please structure your response exactly as follows (use these headers):

### 📘 Concept Explanation
Provide a clear, level-appropriate explanation of the concept.

### 💻 Practical Example
Provide a code example or real-world use case relevant to their {track} track.

### 🧠 Why This Matters
Explain how this concept fits into their learning path and why it's important for {track} development.

### 🧪 Practice Task
Give one short, actionable practice task aligned with their {level} skill level.

### 🚀 Suggested Next Topic
Suggest the next logical topic to learn based on "{topic}".

Keep your response structured, clear, and mentor-like."""

        return prompt

    @staticmethod
    def build_prompt(mode, user_input, context):
        """
        Main prompt builder that routes to appropriate builders based on mode.
        """
        user_level = context.get('user_level', 'beginner')
        current_page = context.get('current_page', 'unknown')

        if mode == 'learn':
            # Use the new dynamic learn prompt builder
            return PromptBuilder.build_learn_prompt(user_input, context)
        elif mode == 'code':
            return f"""
                You are an expert AI Code Assistant.
                Mode: Code Analysis
                Context: User is on {current_page} page and is a {user_level} level learner.
                Task: Analyze the following code or error, explain it, and suggest a fix.
                User Query: {user_input}
            """
        elif mode == 'roadmap':
            return f"""
                You are an expert AI Career Coach.
                Mode: Roadmap Generation
                Context: User is on {current_page} page and is a {user_level} level learner.
                Task: Generate a step-by-step learning roadmap for the following goal.
                User Query: {user_input}
            """
        elif mode == 'productivity':
            return f"""
                You are an expert Productivity Coach.
                Mode: Study Planning
                Context: User is on {current_page} page and is a {user_level} level learner.
                Task: Create a time-based study plan or schedule based on the input.
                User Query: {user_input}
            """
        else:
            return f"Context: {context}. User Query: {user_input}"
