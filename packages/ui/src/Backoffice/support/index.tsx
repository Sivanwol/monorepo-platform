'use client'
import { Paper, Stack, styled } from "@mui/material";
import { initTranslation, t } from "@app/utils";
import { LoadingSpinner } from "@app/ui";
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";
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
  lng,
  ns,
}: SupportProps) => {
  const [translationsLoaded, setTranslationsLoaded] = useState(false);
  useEffect(() => {
    if (!translationsLoaded) {
      const fetcher = async () => {
        await initTranslation(lng);
      };
      fetcher().catch(console.error).finally(() => {
        setTranslationsLoaded(true);
      });
    }
  }, [ns, translationsLoaded, setTranslationsLoaded])
  console.log(`loading ${lng}-${ns}`, translationsLoaded);
  const renderSupportPage = (<Stack spacing={2}>
    <Item style={{ zIndex: -1 }}>
      <h1>{t(ns, 'platformQuestions.categoryUsers.title')}</h1>
      <Accordion>
        <AccordionSummary aria-controls="platformQuestions.categoryUsers_q1-content" id="categoryUsers_q1-header">
          <Typography>{t(ns, 'platformQuestions.categoryUsers.questions.question1.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t(ns, 'platformQuestions.categoryUsers.questions.question1.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="platformQuestions.categoryUsers_q2-content" id="categoryUsers_q2-header">
          <Typography>{t(ns, 'platformQuestions.categoryUsers.questions.question2.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t(ns, 'platformQuestions.categoryUsers.questions.question2.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="platformQuestions.categoryUsers_q2-content" id="categoryUsers_q3-header">
          <Typography>{t(ns, 'platformQuestions.categoryUsers.questions.question3.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t(ns, 'platformQuestions.categoryUsers.questions.question3.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="platformQuestions.categoryUsers_q4-content" id="categoryUsers_q4-header">
          <Typography>{t(ns, 'platformQuestions.categoryUsers.questions.question4.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t(ns, 'platformQuestions.categoryUsers.questions.question4.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
    </Item>
    <Item>
      <h1>{t(ns, 'platformQuestions.categoryRoles.title')}</h1>
      <Accordion>
        <AccordionSummary aria-controls="categoryRoles_q1-content" id="categoryRoles_q1-header">
          <Typography>{t(ns, 'platformQuestions.categoryRoles.questions.question1.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t(ns, 'platformQuestions.categoryRoles.questions.question1.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="categoryRoles_q2-content" id="categoryRoles_q2-header">
          <Typography>{t(ns, 'platformQuestions.categoryRoles.questions.question2.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t(ns, 'platformQuestions.categoryRoles.questions.question2.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="categoryRoles_q2-content" id="categoryRoles_q3-header">
          <Typography>{t(ns, 'platformQuestions.categoryRoles.questions.question3.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t(ns, 'platformQuestions.categoryRoles.questions.question3.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="categoryRoles_q4-content" id="categoryRoles_q4-header">
          <Typography>{t(ns, 'platformQuestions.categoryRoles.questions.question4.title')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t(ns, 'platformQuestions.categoryRoles.questions.question4.answer')}</Typography>
        </AccordionDetails>
      </Accordion>
    </Item>
  </Stack>);
  return (translationsLoaded ? renderSupportPage : <LoadingSpinner />);
}
