# AI Roleplay Integration - Claude/OpenAI

## Overview
Text-only roleplay for customer service scenarios in bartending context.

---

## Input Payload

```json
{
  "session_id": "string",
  "user_id": "string",
  "scenario_id": "string",
  "context": {
    "role": "bartender",
    "setting": "busy_bar_friday_night",
    "difficulty": "medium",
    "customer_profile": {
      "mood": "impatient",
      "preferences": ["whiskey", "no_ice"],
      "occasion": "date_night"
    }
  },
  "conversation_history": [
    {
      "role": "assistant",
      "content": "Good evening! What can I get you tonight?"
    },
    {
      "role": "user",
      "content": "I'd like something strong but smooth."
    }
  ],
  "user_message": "What do you recommend?"
}
```

---

## Output Schema

```json
{
  "session_id": "string",
  "response": {
    "message": "string",
    "tone": "friendly|professional|apologetic",
    "suggestions": ["string"]
  },
  "evaluation": {
    "appropriate": true,
    "tone_match": 0.95,
    "knowledge_accuracy": 0.90,
    "customer_satisfaction": 0.85,
    "issues": []
  },
  "next_scenario_state": {
    "customer_mood": "satisfied|neutral|frustrated",
    "should_continue": true,
    "tips_earned": 5
  },
  "xp_awarded": 25,
  "feedback": "Great recommendation! Customer appreciated your knowledge."
}
```

---

## Prompt Template

```text
You are an AI customer in a bartending training simulation. Your role is to interact with a bartender trainee and evaluate their responses.

SCENARIO CONTEXT:
- Role: {{context.role}}
- Setting: {{context.setting}}
- Difficulty: {{context.difficulty}}
- Customer Profile:
  - Mood: {{context.customer_profile.mood}}
  - Preferences: {{context.customer_profile.preferences}}
  - Occasion: {{context.customer_profile.occasion}}

CONVERSATION HISTORY:
{{#each conversation_history}}
{{role}}: {{content}}
{{/each}}

LATEST USER MESSAGE: {{user_message}}

TASK:
1. Respond as the customer based on the profile and mood
2. Evaluate the trainee's response on:
   - Appropriateness (0-1)
   - Tone match (0-1)
   - Knowledge accuracy (0-1)
   - Customer satisfaction (0-1)
3. Determine next scenario state:
   - Updated customer mood
   - Whether to continue conversation
   - Tips earned (0-10)
4. Calculate XP awarded (0-50 based on performance)
5. Provide constructive feedback

CONSTRAINTS:
- Stay in character as the customer
- Be realistic but educational
- Adjust difficulty based on {{context.difficulty}}
- If trainee makes critical error, mark as inappropriate
- Award higher XP for creative, accurate, and personable responses

OUTPUT FORMAT:
Respond with valid JSON matching the output schema exactly.
```

---

## Implementation Examples

### Claude API Call

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function getRoleplayResponse(input: any) {
  const prompt = buildPrompt(input);

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return JSON.parse(message.content[0].text);
}
```

### OpenAI API Call

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getRoleplayResponse(input: any) {
  const prompt = buildPrompt(input);

  const completion = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an AI customer in a bartending training simulation.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content);
}
```

---

## Sample Scenarios

### Scenario 1: Overwhelmed Customer
```json
{
  "scenario_id": "overwhelmed-menu",
  "context": {
    "role": "bartender",
    "setting": "upscale_cocktail_bar",
    "difficulty": "easy",
    "customer_profile": {
      "mood": "confused",
      "preferences": ["fruity", "not_too_strong"],
      "occasion": "first_date"
    }
  },
  "initial_message": "Wow, this menu is huge... I have no idea what to order."
}
```

### Scenario 2: Difficult Customer
```json
{
  "scenario_id": "picky-regular",
  "context": {
    "role": "bartender",
    "setting": "neighborhood_pub",
    "difficulty": "hard",
    "customer_profile": {
      "mood": "critical",
      "preferences": ["exact_specifications", "high_standards"],
      "occasion": "regular_visit"
    }
  },
  "initial_message": "My usual Old Fashioned, and make sure the orange peel is expressed properly this time."
}
```

### Scenario 3: Rush Hour
```json
{
  "scenario_id": "rush-hour-chaos",
  "context": {
    "role": "bartender",
    "setting": "busy_sports_bar",
    "difficulty": "medium",
    "customer_profile": {
      "mood": "impatient",
      "preferences": ["quick_service", "beer"],
      "occasion": "watching_game"
    }
  },
  "initial_message": "Can I get a beer? Any beer, just make it fast!"
}
```

---

## Evaluation Rubric

| Metric | Weight | Criteria |
|--------|--------|----------|
| Appropriateness | 25% | Response matches context and customer needs |
| Tone Match | 20% | Professional, friendly, matches setting |
| Knowledge Accuracy | 30% | Correct cocktail/bartending information |
| Customer Satisfaction | 25% | Resolved issue, positive interaction |

**XP Calculation:**
```
base_xp = 10
bonus_xp = (appropriateness * 10) + (tone_match * 8) + (knowledge_accuracy * 12) + (customer_satisfaction * 10)
total_xp = base_xp + bonus_xp
```

---

## Error Handling

```json
{
  "error": {
    "code": "INAPPROPRIATE_RESPONSE",
    "message": "Response included unprofessional language",
    "severity": "high",
    "suggestion": "Always maintain professional tone, even with difficult customers"
  },
  "xp_awarded": 0,
  "should_retry": true
}
```
