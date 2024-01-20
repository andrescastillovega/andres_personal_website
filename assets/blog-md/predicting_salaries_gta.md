# Predicting salaries in the Greater Toronto Area: A Bayesian Approach
##### 15 min read
In this post, I present the main results of my master thesis in which I explore the application of bayesian inference for predicting salaries in the Greater Toronto Area (GTA). This work is designed as a component of the <a href="https://uttri.utoronto.ca/files/2018/07/ILUTE-Integrated-Land-Use-Transportation-and-Environment-Model-Reboot.pdf" target="_blank">ILUTE Framework</a> (Integrated Land-Use, Transportation, and Environment), an Agent‑Based simulation model for evaluating land use and transport interactions in urban areas.

## tl;dr
Labour markets and transportation systems are at the core of urban life. Attributes such as residential and work locations, household income, and auto ownership are closely related to the interactions in the labour market. Since salaries are a key component of these interactions, predicting salaries becomes an important task for integrating labour market outcomes into travel behaviour modelling.

Using a data-driven approach, we estimate a Bayesian hierarchical model to predict salary distributions in the Greater Toronto Area. The results of this work demonstrate that this approach provides better estimates at both the aggregated and disaggregated levels and generates more robust predictions by producing probability distributions instead of point estimates. This characteristic is key for using this model in an
urban simulation setting such as the ILUTE framework.

## Hierarchical structure of labour markets
Labour markets are inherently hierarchical. Workers and firms are organized into different industries grouping the purpose and operations of a business within an economy. Similarly, workers can be classified into different occupations based on the tasks and skills required to perform the job. 

In terms of data structure, this relationship can be defined as *one-to-many*. One industry can contain many occupations that cover different processes and tasks. This hierarchy structure defines the category of each firm or worker belongs to and is highly correlated with the wage differentials observed across the labour market. This structure is key for the model specification detailed in the following sections.

<figure>
  <img
  src="../../assets/images/blog_entries/predicting_salaries_gta/hierarchical_structure.png"
  alt="Hierarchical structure of labour markets">
  <!-- <figcaption>Hierarchical structure of labour markets</figcaption> -->
</figure>

## Exploratory Data Analysis
Before defining the prediction model, it is important to understand the data generation process, which provides clues for guiding the model construction. This work was performed using the <a href="https://www150.statcan.gc.ca/n1/en/catalogue/75F0011X" target="_blank"> Survey of Labour and Income Dynamics - SLID</a> from Statistics Canada. As expected, the salary distribution in the GTA is *positive* and *right-skewed*, resembling continous distribution such as <a href="https://www.tandfonline.com/doi/full/10.1080/02664760902811571" target="_blank">Gamma distribution</a>, which is a common choice in the insurance and financial sector to model income and salaries.

<figure>
  <img
  src="../../assets/images/blog_entries/predicting_salaries_gta/salary_dist.png"
  alt="Salary distribution in the GTA between 1993 and 2011">
  <!-- <figcaption>Hierarchical structure of labour markets</figcaption> -->
</figure>

The literature suggests that a person's level of education is a key factor in determining their salary, as it reflects the skills required to execute a job effectively. SLID data indicates that salaries in the GTA increase alongside educational attainment for both men and women, with this trend being more pronounced in males.

<figure>
  <img
  src="../../assets/images/blog_entries/predicting_salaries_gta/salary_edu_gender.png"
  alt="Salary distribution by education level and gender"
  style="width: 800px !important">
  <!-- <figcaption>Hierarchical structure of labour markets</figcaption> -->
</figure>

While education level is a significant factor in explaining salary variability, additional features can play a crucial role in determining salary levels. Since certain industries and occupations require specific skills learned on-the-job, variables such as experience level, age, or job tenure might offer more comprehensive insights than solely considering educational attainment.

<figure>
  <img
  src="../../assets/images/blog_entries/predicting_salaries_gta/pairplot.png"
  alt="Salaries by experience level, age, and tenure"
  style="width: 800px !important">
  <!-- <figcaption>Hierarchical structure of labour markets</figcaption> -->
</figure>

When data is filtered by industry and occupation, the linear relationship between experience, age, tenure, and salary becomes more explicit, as shown in the following chart. This finding supports the idea that the salary variability is closely related with the hierarchical structure of the labour market. This idea will be further explored in the next sections.

<figure>
  <img
  src="../../assets/images/blog_entries/predicting_salaries_gta/salary_ind.png"
  alt="Salary distribution by several attributes in the Public Administration industry"
  style="width: 900px !important">
  <!-- <figcaption>Hierarchical structure of labour markets</figcaption> -->
</figure>

## Model specification
> As discussed in a ~~previous post~~, multilevel model (also known as hierarchical model) is the best approach to model data that is structured in a hierarchical way. Altough different configurations were tested in this work, this post only present the details of the  **hierarchical model** and the comparison with the other alternatives.

From the EDA section, we observed that salaries are positive and right-skewed distributed, which resembles the Gamma distribution. On the other hand, the literature show how the salary of a particular worker can be explained by using a linear combination of different personal attributes. Hence, the model specification must meet this target distribution and the linearity requirements.

A model that meets these requirements is the <a href="https://www.utstat.toronto.edu/~brunner/oldclass/2201s11/readings/glmbook.pdf" target="_blank">Gamma Generalized Linear Model (Gamma GLM)</a>, which belongs to the family of linear models that represents a process in terms of a linear combination with error distribution different from the normal distribution, as in the ordinary linear regression

### Gamma GLM
Given a set of explanatory variables $X=[X_1,X_2,...,X_p]$ and a set of model parameters $\theta = [\theta_0,\theta_1,...,\theta_p]$, the Gamma GLM is defined by the following components:

* **Random component**: The response variable $Y$ follows a Gamma distribution defined by the parameters $\alpha$ and $\beta$ (shape and scale respectively). The expected value of this distribution is $\mu=\frac{\alpha}{\beta}$
    
$$f(y,\alpha, \beta)=\frac{\beta^\alpha}{\varGamma(\alpha)}y^{\alpha-1}e^{-\beta y} \quad \text{,} \quad y > 0$$

* **Systematic component**: The linear combination $\eta$ of explanatory variables $X$ and the model parameters $\theta$.

$$\eta = \theta_0 + \theta_1X_1+\theta_2X_2+...+\theta_pX_p$$

* **Link function**: This function connects the expected value of the target variable with the linear predictor $\eta$ using a log link and ensures that the linear predictor is positive and continuous. When solved for $\mu$, it provides the expectation over the target variable.

$$
\begin{align}
    log(\mu) &= \eta\\\\
    \mu &= e^{\eta}=e^{\theta_0+\theta_1X_1+...+\theta_pX_p}
\end{align}
$$

Hence, the inference process is focused on estimating the parameters $\theta$'s in the systematic component, whereas the parameters $\alpha$ and $\beta$ in the random component are inferred indirectly using the systematic component and the log-link function.

## Model validation and results

## Conclusions

## Acknowledgments
