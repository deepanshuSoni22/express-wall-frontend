import SoundsForLife from '@/assets/growthCourses/soundsforLife.png';
import LanguageForLife from '@/assets/growthCourses/languageForLife.png';
import CreativityForLife from '@/assets/growthCourses/creativityForLife.png';
import HumanizeForLife from '@/assets/growthCourses/humanizeForLife.png';

export interface GrowthCourse {
  id: string; // slug id
  title: string;
  description: string;
  details: string;
  image: string;
  tags?: string[];
}

export const growthCourses: GrowthCourse[] = [
  {
    id: 'sounds-for-life',
    title: 'Sounds for Life',
    description: `Level 1 certification program. 
This course forms the Foundation of Communication. Humans communicate not only with one’s choice of words, but also with the patterns and movement of sound. From the natural rhythms of speech, to the precise timing and characteristics of a consonant, these patterns guide our day-to-day communication. The course works towards removing apprehensions, expressing confidently through multiple channels, and understanding verbal/nonverbal communication while allowing individuals to transition smoothly.`,
    details: `Course Structure: Sounds In Phonetics, Sounds In Phonics, Sounds In Movements, Sounds In Activities`,
    image: SoundsForLife,
    tags: ['40 Modules', '382 Activities', '589 Audio/Video', '7:36 Hours']
  },
  {
    id: 'language-for-life',
    title: 'Language for Life',
    description: `Level 2 certification program. 
This programme focuses on practicing and developing skills pertaining to LSRW - Listening, Speaking, Reading, and Writing. With this established way of learning, skills are habitually gained by Listening, followed by Speaking, Reading, and Writing. These skills enhance communication capabilities, not just for eloquence but also to connect intellectually with peers, improving productivity in organizations. The program augments creativity, innovative thinking, and helps build coping mechanisms through expressive communication.`,
    details: `Course Structure: Listening, Reading, Writing, Speaking`,
    image: LanguageForLife,
    tags: ['80 Modules', '1040 Activities', '343 Audio/Video', '8:22 Hours']
  },
  {
    id: 'creativity-for-life',
    title: 'Creativity for Life',
    description: `Level 3 certification program. 
Creativity for Life (CFL) refines character and taste by enhancing intelligence and worldly experiences — understanding the essence of life. The program combines ‘Drama for Life’ and ‘Art that appeals to one’s senses’, supported by psychological insights that influence behavioral patterns. This unique course provides analytical data to help learners apply creativity across, between, and beyond subject areas.`,
    details: `Course Structure: Who We Are, How We Portray Ourselves, How We Develop`,
    image: CreativityForLife,
    tags: ['30 Modules', '12,531 Activities', '300 Audio/Video', '11:08 Hours']
  },
  {
    id: 'humanize-for-life',
    title: 'Humanize for Life',
    description: `Level 4 certification program. 
This program emphasizes that true organizational success comes when employees realize their roles and take ownership. It highlights that success requires collective effort, not a one-man show. HFL helps candidates align with their organization’s vision, encouraging them to think and act like founders or CXOs. It aims to boost performance and productivity by evolving employee mindsets to create an ‘evolved workspace’.`,
    details: `Course Structure: Awareness, Belief, Achievement`,
    image: HumanizeForLife,
    tags: ['80 Modules', '620 Activities', '200 Audio/Video', '42 Hours']
  }
];
