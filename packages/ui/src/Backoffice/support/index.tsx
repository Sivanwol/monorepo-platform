'use client'
import { Paper, Stack, styled } from "@mui/material";
import { t } from "@app/utils";
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import React from "react";
import { SupportProps } from "./type";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export const SupportAndHelp = ({
  lng
}: SupportProps) => {

  return (<Stack spacing={2}>
    <Item>
      <h1>{t('platformQuestions.categoryUsers.title')}</h1>
      <Accordion>
        <AccordionSummary aria-controls="categoryUsers_q1-content" id="categoryUsers_q1-header">
          <Typography>{t('platformQuestions.categoryUsers.questions.question1.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t('platformQuestions.categoryUsers.questions.question1.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="categoryUsers_q2-content" id="categoryUsers_q2-header">
          <Typography>{t('platformQuestions.categoryUsers.questions.question2.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t('platformQuestions.categoryUsers.questions.question2.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="categoryUsers_q2-content" id="categoryUsers_q3-header">
          <Typography>{t('platformQuestions.categoryUsers.questions.question3.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t('platformQuestions.categoryUsers.questions.question3.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="categoryUsers_q4-content" id="categoryUsers_q4-header">
          <Typography>{t('platformQuestions.categoryUsers.questions.question4.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t('platformQuestions.categoryUsers.questions.question4.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
    </Item>
    <Item>
      <h1>{t('platformQuestions.categoryRoles.title')}</h1>
      <Accordion>
        <AccordionSummary aria-controls="categoryRoles_q1-content" id="categoryRoles_q1-header">
          <Typography>{t('platformQuestions.categoryRoles.questions.question1.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t('platformQuestions.categoryRoles.questions.question1.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="categoryRoles_q2-content" id="categoryRoles_q2-header">
          <Typography>{t('platformQuestions.categoryRoles.questions.question2.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t('platformQuestions.categoryRoles.questions.question2.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="categoryRoles_q2-content" id="categoryRoles_q3-header">
          <Typography>{t('platformQuestions.categoryRoles.questions.question3.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t('platformQuestions.categoryRoles.questions.question3.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="categoryRoles_q4-content" id="categoryRoles_q4-header">
          <Typography>{t('platformQuestions.categoryRoles.questions.question4.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t('platformQuestions.categoryRoles.questions.question4.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
    </Item>
  </Stack>)
}
