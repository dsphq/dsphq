import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

const style = (theme) => ({
    root: {
        maxWidth: 1100,
        margin: '0 auto',
        padding: '16px 8px'
    },
    paper: {
        padding: 24
    },
    markdown: {
        color: theme.palette.text.secondary
    }
});

/* eslint-disable */
const terms = `# Terms of Use #

**THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A WAIVER OF CLASS ACTION RIGHTS AS DETAILED IN SECTION 11. PLEASE READ THE AGREEMENT CAREFULLY.**

_Our Terms of Use have been updated as of June 11, 2019_

## 1. Acceptance of Terms ##

DSP HQ provides a platform for managing and monitoring the EOS blockchain, while keeping the user in control over what transactions they approve, through our website located at https://dsphq.io/ — which includes text, images, audio, code and other materials  (collectively, the “Content”) and all of the features, and services provided. The Site, and any other features, tools, materials, or other services offered from time to time by DSP HQ are referred to here as the “Service.” Please read these Terms of Use (the “Terms” or “Terms of Use”) carefully before using the Service. By using or otherwise accessing the Services, or clicking to accept or agree to these Terms where that option is made available, you (1) accept and agree to these Terms (2) consent to the collection, use, disclosure and other handling of information as described in our Privacy Policy  and (3) any additional terms, rules and conditions of participation issued by DSP HQ from time to time. If you do not agree to the Terms, then you may not access or use the Content or Services.

## 2. Modification of Terms of Use ##

Except for Section 13, providing for binding arbitration and waiver of class action rights, DSP HQ reserves the right, at its sole discretion, to modify or replace the Terms of Use at any time. The most current version of these Terms will be posted on our Site. You shall be responsible for reviewing and becoming familiar with any such modifications. Use of the Services by you after any modification to the Terms constitutes your acceptance of the Terms of Use as modified.


## 3. Eligibility ##

You hereby represent and warrant that you are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations and warranties set forth in these Terms and to abide by and comply with these Terms.

DSP HQ is a global platform and by accessing the Content or Services, you are representing and warranting that, you are of the legal age of majority in your jurisdiction as is required to access such Services and Content and enter into arrangements as provided by the Service. You further represent that you are otherwise legally permitted to use the service in your jurisdiction including owning cryptographic tokens of value, and interacting with the Services or Content in any way. You further represent you are responsible for ensuring compliance with the laws of your jurisdiction and acknowledge that DSP HQ is not liable for your compliance with such laws.

## 4. Representations, Warranties, and Risks ##

### 4.1. Warranty Disclaimer ###

You expressly understand and agree that your use of the Service is at your sole risk. The Service (including the Service and the Content) are provided on an "AS IS" and "as available" basis, without warranties of any kind, either express or implied, including, without limitation, implied warranties of merchantability, fitness for a particular purpose or non-infringement. You acknowledge that DSP HQ has no control over, and no duty to take any action regarding: which users gain access to or use the Service; what effects the Content may have on you; how you may interpret or use the Content; or what actions you may take as a result of having been exposed to the Content. You release DSP HQ from all liability for you having acquired or not acquired Content through the Service. DSP HQ makes no representations concerning any Content contained in or accessed through the Service, and DSP HQ will not be responsible or liable for the accuracy, copyright compliance, legality or decency of material contained in or accessed through the Service.

You understand and agree that temporary interruptions of the services available through this Website may occur as normal events. You further understand and agree that we have no control over third party networks you may access in the course of the use of this Website, and therefore, delays and disruption of other network transmissions are completely beyond our control.

You understand and agree that the services available on this Website are provided "AS IS" and that we assume no responsibility for the timeliness, deletion, mis-delivery, or accuracy of any information presented on this website.

### 4.2 Sophistication and Risk of Cryptographic Systems ###

By utilizing the Service or interacting with the Content or platform in any way, you represent that you understand the inherent risks associated with cryptographic systems; and warrant that you have an understanding of the usage and intricacies of native cryptographic tokens, like EOS, smart contracts, and blockchain-based software systems.

### 4.3 Risk of Regulatory Actions in One or More Jurisdictions ###

DSP HQ and the EOS blockchain could be impacted by one or more regulatory inquiries or regulatory action, which could impede or limit the ability of DSP HQ to continue to develop, or which could impede or limit your ability to access or use the Service or EOS blockchain.

### 4.4 Risk of Weaknesses or Exploits in the Field of Cryptography ###

You acknowledge and understand that Cryptography is a progressing field. Advances in code cracking or technical advances such as the development of quantum computers may present risks to cryptocurrencies and Services of Content, which could result in the theft or loss of your cryptographic tokens or property. To the extent possible, DSP HQ intends to update the protocol underlying Services to account for any advances in cryptography and to incorporate additional security measures, but does not guarantee or otherwise represent full security of the system. By using the Service or accessing Content, you acknowledge these inherent risks.

### 4.5 Volatility of Crypto Currencies ###

You understand that EOS and other blockchain technologies and associated currencies or tokens are highly volatile due to many factors including but not limited to adoption, speculation, technology and security risks. You also acknowledge that the cost of transacting on such technologies is variable and may increase at any time causing impact to any activities taking place on the EOS blockchain. You acknowledge these risks and represent that DSP HQ cannot be held liable for such fluctuations or increased costs.

### 4.6 Application Security ###

You acknowledge that EOS applications are code subject to flaws and acknowledge that you are solely responsible for evaluating any code provided by the Services or Content and the trustworthiness of any third-party websites, products, smart-contracts, or Content you access or use through the Service. You further expressly acknowledge and represent that EOS applications can be written maliciously or negligently, that DSP HQ cannot be held liable for your interaction with such applications and that such applications may cause the loss of property or even identity. This warning and others later provided by DSP HQ in no way evidence or represent an on-going duty to alert you to all of the potential risks of utilizing the Service or Content.

## 5. Indemnity ##

You agree to release and to indemnify, defend and hold harmless DSP HQ and its parents, subsidiaries, affiliates and agencies, as well as the officers, directors, employees, shareholders and representatives of any of the foregoing entities, from and against any and all losses, liabilities, expenses, damages, costs (including attorneys’ fees and court costs) claims or actions of any kind whatsoever arising or resulting from your use of the Service, your violation of these Terms of Use, and any of your acts or omissions that implicate publicity rights, defamation or invasion of privacy. DSP HQ reserves the right, at its own expense, to assume exclusive defense and control of any matter otherwise subject to indemnification by you and, in such case, you agree to cooperate with DSP HQ in the defense of such matter.

## 6. Limitation on liability ##

YOU ACKNOWLEDGE AND AGREE THAT YOU ASSUME FULL RESPONSIBILITY FOR YOUR USE OF THE SITE AND SERVICE. YOU ACKNOWLEDGE AND AGREE THAT ANY INFORMATION YOU SEND OR RECEIVE DURING YOUR USE OF THE SITE AND SERVICE MAY NOT BE SECURE AND MAY BE INTERCEPTED OR LATER ACQUIRED BY UNAUTHORIZED PARTIES. YOU ACKNOWLEDGE AND AGREE THAT YOUR USE OF THE SITE AND SERVICE IS AT YOUR OWN RISK. RECOGNIZING SUCH, YOU UNDERSTAND AND AGREE THAT, TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, NEITHER DSP HQ NOR ITS SUPPLIERS OR LICENSORS WILL BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, EXEMPLARY OR OTHER DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER TANGIBLE OR INTANGIBLE LOSSES OR ANY OTHER DAMAGES BASED ON CONTRACT, TORT, STRICT LIABILITY OR ANY OTHER THEORY (EVEN IF DSP HQ HAD BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM THE SITE OR SERVICE; THE USE OR THE INABILITY TO USE THE SITE OR SERVICE; UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE SITE OR SERVICE; ANY ACTIONS WE TAKE OR FAIL TO TAKE AS A RESULT OF COMMUNICATIONS YOU SEND TO US; HUMAN ERRORS; TECHNICAL MALFUNCTIONS; FAILURES, INCLUDING PUBLIC UTILITY OR TELEPHONE OUTAGES; OMISSIONS, INTERRUPTIONS, LATENCY, DELETIONS OR DEFECTS OF ANY DEVICE OR NETWORK, PROVIDERS, OR SOFTWARE (INCLUDING, BUT NOT LIMITED TO, THOSE THAT DO NOT PERMIT PARTICIPATION IN THE SERVICE); ANY INJURY OR DAMAGE TO COMPUTER EQUIPMENT; INABILITY TO FULLY ACCESS THE SITE OR SERVICE OR ANY OTHER WEBSITE; THEFT, TAMPERING, DESTRUCTION, OR UNAUTHORIZED ACCESS TO, IMAGES OR OTHER CONTENT OF ANY KIND; DATA THAT IS PROCESSED LATE OR INCORRECTLY OR IS INCOMPLETE OR LOST; TYPOGRAPHICAL, PRINTING OR OTHER ERRORS, OR ANY COMBINATION THEREOF; OR ANY OTHER MATTER RELATING TO THE SITE OR SERVICE.

SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.

## 7. Our Proprietary Rights ##

All title, ownership and intellectual property rights in and to the Service are owned by DSP HQ or its licensors. You acknowledge and agree that the Service contains proprietary and confidential information that is protected by applicable intellectual property and other laws. Except as expressly authorized by DSP HQ, you agree not to copy, modify, rent, lease, loan, sell, distribute, perform, display or create derivative works based on the Service.

## 8. Links ##

The Service provides, or third parties may provide, links to other World Wide Web  or accessible sites, applications or resources. Because DSP HQ has no control over such sites, applications and resources, you acknowledge and agree that DSP HQ is not responsible for the availability of such external sites, applications or resources, and does not endorse and is not responsible or liable for any content, advertising, products or other materials on or available from such sites or resources. You further acknowledge and agree that DSP HQ shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such site or resource.

## 9. Termination and Suspension ##

DSP HQ may terminate or suspend all or part of the Service and your DSP HQ access immediately, without prior notice or liability, if you breach any of the terms or conditions of the Terms. Upon termination of your access, your right to use the Service will immediately cease.

The following provisions of the Terms survive any termination of these Terms: INDEMNITY; WARRANTY DISCLAIMERS; LIMITATION ON LIABILITY; OUR PROPRIETARY RIGHTS; LINKS; TERMINATION; NO THIRD PARTY BENEFICIARIES; BINDING ARBITRATION AND CLASS ACTION WAIVER; GENERAL INFORMATION.

## 10. No Third Party Beneficiaries ##

You agree that, except as otherwise expressly provided in these Terms, there shall be no third party beneficiaries to the Terms.

## 11. Binding Arbitration and Class Action Waiver ##

PLEASE READ THIS SECTION CAREFULLY – IT MAY SIGNIFICANTLY AFFECT YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT

### 11.1 Initial Dispute Resolution ###

The parties shall use their best efforts to engage directly to settle any dispute, claim, question, or disagreement and engage in good faith negotiations which shall be a condition to either party initiating a lawsuit or arbitration.

### 11.2 Binding Arbitration ###

If the parties do not reach an agreed upon solution within a period of 30 days from the time informal dispute resolution under the Initial Dispute Resolution provision begins, then either party may initiate binding arbitration as the sole means to resolve claims, subject to the terms set forth below. Specifically, all claims arising out of or relating to these Terms (including their formation, performance and breach), the parties’ relationship with each other and/or your use of the Service shall be finally settled by binding arbitration administered by the American Arbitration Association in accordance with the provisions of its Commercial Arbitration Rules and the supplementary procedures for consumer related disputes of the American Arbitration Association (the "AAA"), excluding any rules or procedures governing or permitting class actions.

The arbitrator, and not any federal, state or local court or agency, shall have exclusive authority to resolve all disputes arising out of or relating to the interpretation, applicability, enforceability or formation of these Terms, including, but not limited to any claim that all or any part of these Terms are void or voidable, or whether a claim is subject to arbitration. The arbitrator shall be empowered to grant whatever relief would be available in a court under law or in equity. The arbitrator’s award shall be written, and binding on the parties and may be entered as a judgment in any court of competent jurisdiction.

The parties understand that, absent this mandatory provision, they would have the right to sue in court and have a jury trial. They further understand that, in some instances, the costs of arbitration could exceed the costs of litigation and the right to discovery may be more limited in arbitration than in court.

### 11.3 Location ###

Binding arbitration shall take place in Florida. You agree to submit to the personal jurisdiction of any federal or state court in Brevard County, Florida, in order to compel arbitration, to stay proceedings pending arbitration, or to confirm, modify, vacate or enter judgment on the award entered by the arbitrator.

### 11.4 Class Action Waiver ###

The parties further agree that any arbitration shall be conducted in their individual capacities only and not as a class action or other representative action, and the parties expressly waive their right to file a class action or seek relief on a class basis. YOU AND DSP HQ AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. If any court or arbitrator determines that the class action waiver set forth in this paragraph is void or unenforceable for any reason or that an arbitration can proceed on a class basis, then the arbitration provision set forth above shall be deemed null and void in its entirety and the parties shall be deemed to have not agreed to arbitrate disputes.

### 11.5 Exception - Litigation of Intellectual Property and Small Claims Court Claims ###

Notwithstanding the parties' decision to resolve all disputes through arbitration, either party may bring an action in state or federal court to protect its intellectual property rights ("intellectual property rights" means patents, copyrights, moral rights, trademarks, and trade secrets, but not privacy or publicity rights). Either party may also seek relief in a small claims court for disputes or claims within the scope of that court’s jurisdiction.

## 12. General Information ##

### 12.1 Entire Agreement ###

These Terms (and any additional terms, rules and conditions of participation that DSP HQ may post on the Service) constitute the entire agreement between you and DSP HQ with respect to the Service and supersedes any prior agreements, oral or written, between you and DSP HQ. In the event of a conflict between these Terms and the additional terms, rules and conditions of participation, the latter will prevail over the Terms to the extent of the conflict.

### 12.2 Waiver and Severability of Terms ###

The failure of DSP HQ to exercise or enforce any right or provision of the Terms shall not constitute a waiver of such right or provision. If any provision of the Terms is found by an arbitrator or court of competent jurisdiction to be invalid, the parties nevertheless agree that the arbitrator or court should endeavor to give effect to the parties' intentions as reflected in the provision, and the other provisions of the Terms remain in full force and effect.

### 12.3 Statute of Limitations ###

You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to the use of the Service or the Terms must be filed within one (1) year after such claim or cause of action arose or be forever barred.

### 12.4 Section Titles ###

The section titles in the Terms are for convenience only and have no legal or contractual effect.
`;
/* eslint-enable */

function TermsOfUsePage({ classes }) {
    return (
        <div className={classes.root}>
            <Paper classes={{ root: classes.paper }}>
                <ReactMarkdown className={classes.markdown} source={terms} disallowedTypes={['link']} unwrapDisallowed />
            </Paper>
        </div>
    );
}

TermsOfUsePage.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(TermsOfUsePage);
