import { z } from 'zod';

export const FeatureSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Feature name is required'),
  description: z.string().min(10, 'Description must be detailed'),
  type: z.enum(['user-story', 'epic', 'task', 'bug-fix']).default('user-story'),
  technicalDetails: z
    .object({
      endpoints: z.array(z.string()).optional(),
      components: z.array(z.string()).optional(),
      dependencies: z.array(z.string()).optional(),
    })
    .optional(),
  businessRules: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const validateFeature = data => {
  return FeatureSchema.parse(data);
};
